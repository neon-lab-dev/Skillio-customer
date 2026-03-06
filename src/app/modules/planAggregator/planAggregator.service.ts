import { Loggable, NotFoundError } from "@neon-lab-dev/platform";
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

  private async checkExisting(portfolioId: string): Promise<PlanAggregator> {
    const existing = await this.repository.findByPortfolioId(portfolioId);
    if (!existing) {
      throw new NotFoundError("Plan aggregator does not exist");
    }
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
  public async aggregate(req: PlanAggregatorRequestDto, portfolioId: string) {
    const existingPlanAggregator =
      await this.repository.findByPortfolioId(portfolioId);
    const updated = existingPlanAggregator
      ? this.merge(existingPlanAggregator, req)
      : this.project(req);
    if(existingPlanAggregator){
      await this.update(updated , portfolioId);
    }else{
      const entity= PlanAggregatorEntityBuilder.builder().of({...updated , portfolioId: portfolioId}).build();
      await this.repository.save(entity);
    }
  }

  @Loggable()
  private async update(
    planAggregator: Partial<PlanAggregator>,
    portfolioId: string,
  ) {
    await this.repository.update(planAggregator, portfolioId);
  }

  @Loggable()
  public async fetch(
    req: FetchPlanAggregatorRequestDto,
  ): Promise<planAggregatorResponseDto> {
    const res = await this.checkExisting(req.portfolioId);
    return PlanAggregatorResponseDtoBuilder.builder().of(res).build();
  }

  @Loggable()
  public async fetchAll():Promise<PlanAggregator[]>{
    return await this.repository.findAll();
  }


  @Loggable()
  public async reduceCallLimits(portfolioId: string, amount?: number) {
    const planAggregator = await this.checkExisting(portfolioId);
    const result = await this.repository.reduceCallLimits(
      portfolioId,
      planAggregator.version,
      amount,
    );
    if (result.affected == 0) {
      throw new OptimisticLockError();
    }
  }

  @Loggable()
  public async reduceChatLimits(portfolioId: string, amount?: number) {
    const planAggregator = await this.checkExisting(portfolioId);
    const result = await this.repository.reduceChatLimits(
      portfolioId,
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
        await this.reduceCallLimits(planAggregator.portfolioId , callLimit);
      }
      else if (remainingSubscriptions.length == 0 && subscription.planDetails.callLimits) {
        await this.reduceCallLimits(planAggregator.portfolioId , planAggregator.callLimits);
      }

      // for chat limits
      if (
        remainingSubscriptions.length != 0 &&
        subscription.planDetails.chatLimits &&
        (planAggregator.chatLimits > subscription.planDetails.chatLimits ||  (planAggregator.chatLimits< subscription.planDetails.chatLimits && planAggregator.chatLimits > remainingSubscriptionsChatLimit))
      ) {
        const chatLimit= planAggregator.chatLimits- remainingSubscriptionsChatLimit;
        await this.reduceChatLimits(planAggregator.portfolioId , chatLimit);
      }else if(remainingSubscriptions.length===0 && subscription.planDetails.chatLimits){
        await this.reduceChatLimits(planAggregator.portfolioId , planAggregator.chatLimits);
      }

      await userSubscriptionService.expire(subscription.id);

    });
  }
}

export default new PlanAggregatorService();
