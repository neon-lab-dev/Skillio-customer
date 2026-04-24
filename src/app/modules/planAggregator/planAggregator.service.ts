import { AppValidationError, ERROR_CODES, Loggable, NotFoundError } from "@neon-lab-dev/platform";
import { PlanAggregator } from "../entity/planAggregator";
import { ProfileVisibility } from "../planMaster/enum/ProfileVisibility";
import { FetchPlanAggregatorRequestDto } from "./models/request/fetchPlanAggregatorRequestDto";
import { PlanAggregatorRequestDto } from "./models/request/planAggregatorRequestDto";
import { planAggregatorResponseDto } from "./models/response/PlanAggregatorResponseDto";
import { PlanAggregatorRepository } from "./repository/planAggregatorRepository";
import { PlanAggregatorResponseDtoBuilder } from "./models/builder/planAggregatorResponseDtoBuilder";
import { OptimisticLockError } from "../../errors/optimisticLockError";
import { userSubscriptionService } from "../userSubscription/service/service.user.subscription";
import { SubscriptionStatus } from "../userSubscription/enums/SubscriptionStatus";
import { PlanAggregatorEntityBuilder } from "./models/builder/planAggregatorEntityBuilder";

class PlanAggregatorService {
  private repository: PlanAggregatorRepository = new PlanAggregatorRepository();

  private async checkExisting(profileId: string): Promise<PlanAggregator | null> {
    const existing = await this.repository.findByProfileId(profileId);
    return existing;
  }

  private merge(existing: PlanAggregator, req: PlanAggregatorRequestDto) {
    const updated = {
      callLimits: existing.callLimits + req.callLimits,
      chatLimits: existing.chatLimits + req.chatLimits,
      profileVisibility:
        existing.profileVisibility === ProfileVisibility.ONE
          ? existing.profileVisibility
          : req.profileVisibility,
      userSubscriptionIds: [
        ...existing.userSubscriptionIds,
        req.userSubscriptionId,
      ],
      activePlans: existing.activePlans + 1,
    };
    return updated;
  }

  private project(req: PlanAggregatorRequestDto) {
    const planAggregator = {
      callLimits: req.callLimits,
      chatLimits: req.chatLimits,
      profileVisibility: req.profileVisibility,
      userSubscriptionIds: [req.userSubscriptionId],
      activePlans: 1,
    };
    return planAggregator;
  }

  @Loggable()
  public async aggregate(req: PlanAggregatorRequestDto, profileId: string) {
    const existingPlanAggregator =
      await this.repository.findByProfileId(profileId);
    const updated = existingPlanAggregator
      ? this.merge(existingPlanAggregator, req)
      : this.project(req);
    if(existingPlanAggregator){
      await this.update(updated , profileId);
    }else{
      const entity= PlanAggregatorEntityBuilder.builder().of({...updated , profileId: profileId}).build();
      await this.repository.save(entity);
    }
  }

  @Loggable()
  private async update(
    planAggregator: Partial<PlanAggregator>,
    profileId: string,
  ) {
    await this.repository.update(planAggregator, profileId);
  }

  @Loggable()
  public async fetch(
    req: FetchPlanAggregatorRequestDto,
  ): Promise<planAggregatorResponseDto> {
    const res = await this.checkExisting(req.profileId);
    if(!res){
      throw new AppValidationError(" please check your subscription status" , ERROR_CODES.RECORD_NOT_FOUND)
    }
    return PlanAggregatorResponseDtoBuilder.builder().of(res).build();
  }

  @Loggable()
  public async fetchAll():Promise<PlanAggregator[]>{
    return await this.repository.findAll();
  }


  @Loggable()
  public async reduceCallLimits(profileId: string, amount?: number) {
    const planAggregator = await this.checkExisting(profileId);
    if(!planAggregator){
      throw new NotFoundError("plan Aggregator does not exist");
    }
    const result = await this.repository.reduceCallLimits(
      profileId,
      planAggregator.version,
      amount,
    );
    if (result.affected == 0) {
      throw new OptimisticLockError();
    }
  }

  @Loggable()
  public async reduceChatLimits(profileId: string, amount?: number) {
    const planAggregator = await this.checkExisting(profileId);
    if(!planAggregator){
      throw new NotFoundError("plan Aggregator does not exist");
    }
    const result = await this.repository.reduceChatLimits(
      profileId,
      planAggregator.version,
      amount,
    );
    if (result.affected == 0) {
      throw new OptimisticLockError();
    }
  }

  @Loggable()
  public async expirePlanAggregatorUserSubscriptions(planAggregator: PlanAggregator) {
    const userSubscriptions = await Promise.all(
      planAggregator.userSubscriptionIds.map(async (id) => {
        return await userSubscriptionService.fetchById(id);
      }),
    );

    const activeExpiredSubscriptions = userSubscriptions.filter(
      (userSub) => new Date() > userSub.endDate && userSub.status != SubscriptionStatus.EXPIRED,
    );
    
    if (activeExpiredSubscriptions.length === 0) {
        return;
    }

    const remainingSubscriptions = userSubscriptions.filter(
      (userSub) => new Date() < userSub.endDate,
    );

    let remainingSubscriptionsCallLimit = 0;
    let remainingSubscriptionsChatLimit = 0;

    remainingSubscriptions.forEach((sub) => {
      if (sub.planDetails.callLimits)
        remainingSubscriptionsCallLimit += sub.planDetails.callLimits;
      if (sub.planDetails.chatLimits)
        remainingSubscriptionsChatLimit += sub.planDetails.chatLimits;
    });

    activeExpiredSubscriptions.map(async(subscription) => {
      // for call limits
      if (
        remainingSubscriptions.length != 0 &&
        subscription.planDetails.callLimits &&
        (planAggregator.callLimits > subscription.planDetails.callLimits ||  (planAggregator.callLimits< subscription.planDetails.callLimits && planAggregator.callLimits > remainingSubscriptionsCallLimit))
      ) {
        const callLimit = planAggregator.callLimits - remainingSubscriptionsCallLimit;
        await this.reduceCallLimits(planAggregator.profileId , callLimit);
      }
      else if (remainingSubscriptions.length == 0 && subscription.planDetails.callLimits) {
        await this.reduceCallLimits(planAggregator.profileId , planAggregator.callLimits);
      }

      // for chat limits
      if (
        remainingSubscriptions.length != 0 &&
        subscription.planDetails.chatLimits &&
        (planAggregator.chatLimits > subscription.planDetails.chatLimits ||  (planAggregator.chatLimits< subscription.planDetails.chatLimits && planAggregator.chatLimits > remainingSubscriptionsChatLimit))
      ) {
        const chatLimit= planAggregator.chatLimits- remainingSubscriptionsChatLimit;
        await this.reduceChatLimits(planAggregator.profileId , chatLimit);
      }else if(remainingSubscriptions.length===0 && subscription.planDetails.chatLimits){
        await this.reduceChatLimits(planAggregator.profileId , planAggregator.chatLimits);
      }

      await userSubscriptionService.expire(subscription.id);

    });
  }
}

export default new PlanAggregatorService();
