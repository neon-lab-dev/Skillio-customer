import { AppValidationError, ERROR_CODES, Loggable, LoggerService } from "@neon-lab-dev/platform";
import { UserSubscriptionRepository } from "../repository/repository.user.subscription";
import { InitiateUserSubscriptionRequest } from "../models/request/request.create";
import { Profile } from "../../../entity/profile";
import { InitiateUserSubscriptionResponse } from "../models/response/response.user.subscription";
import { createUserSubscriptionSchema } from "../models/schema/schema.user.subscription";
import { planMasterService } from "../../planMaster/service/service.plan.master";
import { PlanMasterEntity } from "../../entity/PlanMasterEntity";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";
import { paymentProxyService } from "../../../service/payment-proxy/service.payment-proxy";
import { PaymentResponseDto } from "../../../service/payment-proxy/models/dto.payment.response";
import { UserSubscriptionEntity } from "../../entity/UserSubscriptionEntity";
import { globalMapper } from "../../../mapper.global";
import { PlanDetails } from "../models/dto/dto.plan.details";
import { InitiateUserSubscriptionBuilder } from "../models/response/builder.user.subscription.response";
import { PaymentRequestBuilder } from "../../../service/payment-proxy/models/builder.payment.request";

class UserSubscriptionService {

    private repository: UserSubscriptionRepository = new UserSubscriptionRepository();


    @Loggable()
    public async validateInitiate( 
        req: InitiateUserSubscriptionRequest){
        createUserSubscriptionSchema.parse(req);
    }

    @Loggable()
    public async initiate(
        req: InitiateUserSubscriptionRequest,
        loggedInUserProfile: Profile
    ): Promise<InitiateUserSubscriptionResponse>{
        let planMaster = await planMasterService.fetchById(req.planId);
        await this.validateExistingNonTerminalSubscription(planMaster, loggedInUserProfile);
        let paymentResponse = await this.initiatePayment(planMaster, loggedInUserProfile);
        //LoggerService.info( `instance of ${paymentResponse instanceof PaymentResponseDto}. value ${paymentResponse.fetchPaymentLink()}`);
        let entity = await this.fetchEntity(planMaster, loggedInUserProfile, paymentResponse);
        let savedEntity = await this.repository.save(entity);
        return InitiateUserSubscriptionBuilder.builder()
                .of(savedEntity!, paymentResponse)
                .build();
    }

    private async validateExistingNonTerminalSubscription(
        plan: PlanMasterEntity,
        loggedInUserProfile: Profile
    ){
        let portfolio = loggedInUserProfile.portfolio;
        let existing = await this.repository.findByPortfolioIdPlanCodeAndStatusIn(
            portfolio.id,
            plan.code,
            [SubscriptionStatus.PENDING, SubscriptionStatus.INITIATED]
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
        retVal.planDetails = planDetails;
        retVal.paymentId = paymentResponse.id;
        retVal.planCode = planMaster.code;
        retVal.portfolioId = loggedInUserProfile.portfolio.id;
        return retVal;
    }

    private async initiatePayment(
        plan: PlanMasterEntity,
        loggedInUserProfile: Profile
    ): Promise<PaymentResponseDto> {
        let request = PaymentRequestBuilder.builder().of(plan.priceInPaise, loggedInUserProfile.id).build();
        return await paymentProxyService.initate(request);
    }

}

export const userSubscriptionService = new UserSubscriptionService();