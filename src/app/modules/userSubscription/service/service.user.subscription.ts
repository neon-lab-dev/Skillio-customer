import { AppValidationError, AsyncContextService, ERROR_CODES, Loggable, LoggerService, NotFoundError } from "@neon-lab-dev/platform";
import { UserSubscriptionRepository } from "../repository/repository.user.subscription";
import { UserSubscriptionRequest } from "../models/request/request.create";
import { Profile } from "../../../entity/profile";
import { UserSubscriptionResponse } from "../models/response/response.user.subscription";
import { createUserSubscriptionSchema } from "../models/schema/schema.user.subscription";
import { planMasterService } from "../../planMaster/service/service.plan.master";
import { PlanMasterEntity } from "../../entity/PlanMasterEntity";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";
import { paymentProxyService } from "../../../service/payment-proxy/service.payment-proxy";
import { PaymentResponseDto } from "../../../service/payment-proxy/models/dto.payment.response";
import { UserSubscriptionEntity } from "../../entity/UserSubscriptionEntity";
import { globalMapper } from "../../../mapper.global";
import { PlanDetails } from "../models/dto/dto.plan.details";
import { UserSubscriptionBuilder } from "../models/response/builder.user.subscription.response";
import { PaymentRequestBuilder } from "../../../service/payment-proxy/models/builder.payment.request";
import { SyncSubscriptionStatusRequest } from "../models/request/request.sync";
import { PaymentLinkStatusRequest } from "../../../service/payment-proxy/models/dto.request.payment.link.status";
import { FAILED, SUCCESS } from "../../../service/payment-proxy/constants/constants.payment.proxy";
import planAggregatorService from "../../planAggregator/planAggregator.service";

class UserSubscriptionService {

    private repository: UserSubscriptionRepository = new UserSubscriptionRepository();


    @Loggable()
    public async validateInitiate( 
        req: UserSubscriptionRequest){
        createUserSubscriptionSchema.parse(req);
    }

    @Loggable()
    public async initiate(
        req: UserSubscriptionRequest,
        loggedInUserProfile: Profile
    ): Promise<UserSubscriptionResponse>{
        if(!loggedInUserProfile.isOnboarded){
            throw new AppValidationError("User has not completed onboarding" ,ERROR_CODES.ACCESS_DENIED)
        }
        let planMaster = await planMasterService.checkExisting(req.planId);
        await this.validateExistingNonTerminalSubscription(planMaster, loggedInUserProfile);
        let paymentResponse = await this.initiatePayment(planMaster, loggedInUserProfile);
        let entity = await this.fetchEntity(planMaster, loggedInUserProfile, paymentResponse);
        let savedEntity = await this.repository.save(entity);
        return UserSubscriptionBuilder.builder()
                .of(savedEntity!)
                .build();
    }

    private async validateExistingNonTerminalSubscription(
        plan: PlanMasterEntity,
        loggedInUserProfile: Profile
    ){
        let existing = await this.findByPorfileIdPlanCodeAndStatusIn(
            loggedInUserProfile!.id,
            plan.code,
            [SubscriptionStatus.INITIATED]
        );
        if (existing && existing.length > 0){
            throw new AppValidationError(`Subscription with non-terminal status exists for the current plan. Please fetch the existing and continue.`,
                ERROR_CODES.DUPLICATE_ENTRY
            )
        }
    }

    private async fetchEntity(
        planMaster: PlanMasterEntity,
        loggedInUserProfile: Profile,
        paymentResponse: PaymentResponseDto
    ): Promise<UserSubscriptionEntity> {
        let planDetails = globalMapper.map(planMaster, PlanMasterEntity, PlanDetails);
        let retVal = new UserSubscriptionEntity();
        retVal.planId= planMaster.id;
        retVal.planDetails = planDetails;
        retVal.paymentId = paymentResponse.id;
        retVal.paymentLink = paymentResponse.fetchPaymentLink();
        retVal.planCode = planMaster.code;
        retVal.profileId = loggedInUserProfile.id;
        return retVal;
    }

    private async initiatePayment(
        plan: PlanMasterEntity,
        loggedInUserProfile: Profile
    ): Promise<PaymentResponseDto> {
        let request = PaymentRequestBuilder.builder().of(plan.priceInPaise, loggedInUserProfile.id).build();
        return await paymentProxyService.initate(request);
    }

    private async findByPorfileIdPlanCodeAndStatusIn(
        profileId: string,
        planCode: string,
        statuses: SubscriptionStatus[]
    ): Promise<UserSubscriptionEntity[]>{
        return await this.repository.findByPorfileIdPlanCodeAndStatusIn(
            profileId, planCode, statuses
        );
    }

    @Loggable()
    public async fetch(req: UserSubscriptionRequest, loggedInUserProfile: Profile): Promise<UserSubscriptionResponse | null>{
        let planMaster = await planMasterService.checkExisting(req.planId);
        let existing = await this.findByPorfileIdPlanCodeAndStatusIn(
            loggedInUserProfile!.id,
            planMaster.code,
            [SubscriptionStatus.INITIATED]
        );
        if (existing && existing.length === 1){
            return UserSubscriptionBuilder.builder()
                .of(existing[0])
                .build();
        }
        return null;
    }

    @Loggable()
    public async syncStatus( req: SyncSubscriptionStatusRequest ): Promise<UserSubscriptionResponse> {
        let entity = await this.fetchById(req.id);
        let paymentId = entity.paymentId;
        let paymentResponse = await paymentProxyService.fetchStatus( new PaymentLinkStatusRequest(paymentId, req.hard));
        entity = await this.processPaymentStatusUpdated(entity, paymentResponse);
        return UserSubscriptionBuilder.builder()
            .of(entity).build();
    }

    private async processPaymentStatusUpdated(
        entity: UserSubscriptionEntity,
        paymentResponse: PaymentResponseDto
    ): Promise<UserSubscriptionEntity> {
        let paymentStatus = paymentResponse.status;
        switch (paymentStatus) {

            case FAILED:
                return await this.processPaymentFailed(entity, paymentResponse);
            
            case SUCCESS:
                return await this.processPaymentSuccess(entity, paymentResponse);

            default:
                break;

        }
        return entity;
    }

    private async processPaymentFailed(
        entity: UserSubscriptionEntity,
        paymentResponse: PaymentResponseDto
    ): Promise<UserSubscriptionEntity> {
        entity.status = SubscriptionStatus.FAILED;
        return await this.repository.save(entity) as UserSubscriptionEntity;
    }

    private async processPaymentSuccess(
        entity: UserSubscriptionEntity,
        paymentResponse: PaymentResponseDto
    ): Promise<UserSubscriptionEntity>{
        entity.status = SubscriptionStatus.SUCCESS;
        entity.startDate = new Date();
        entity.setEndDate();
        const planMaster= await planMasterService.fetchPlanMasterEntityById({id: entity.planId});
        const userId= AsyncContextService.getUserId() as string;
        planAggregatorService.aggregate({
            callLimits: planMaster.callLimits,
            chatLimits:planMaster.chatLimits,
            profileVisibility: planMaster.profileVisibility,
            userSubscriptionId: entity!.id
        } ,userId)
        return await this.repository.save(entity) as UserSubscriptionEntity;

    }

    public async fetchById( id: string): Promise<UserSubscriptionEntity> {
        let retVal = await this.repository.findById(id);
        if (retVal){
            return retVal;
        }
        throw new NotFoundError(`User Subscription not found with id ${id}`);
    }

    @Loggable()
    public async fetchActiveSubscriptionsCount():Promise<number>{
        return await this.repository.fetchActiveUserSubscriptionsCount();
    }

    @Loggable()
    public async expire(id:string){
        return await this.repository.updateStatus(id);
    }

}

export const userSubscriptionService = new UserSubscriptionService();