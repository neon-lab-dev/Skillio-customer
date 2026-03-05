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
      callLimtis: existing.callLimits + req.callLimits,
      chatLimits: existing.chatLimits + req.chatLimits,
      profileVisibility:
        existing.profileVisibility === ProfileVisibility.ONE
          ? existing.profileVisibility
          : req.profileVisibility,
      userSubscriptionIds: [
        ...existing.userSubscriptionIds,
        req.userSubscriptionId,
      ],
      activePlans: existing.acitvePlans + 1,
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
    await this.upsert(updated, portfolioId);
  }

  @Loggable()
  private async upsert(
    planAggregator: Partial<PlanAggregator>,
    portfolioId: string,
  ) {
    await this.repository.upsert(planAggregator, portfolioId);
  }

  @Loggable()
  public async fetch(
    req: FetchPlanAggregatorRequestDto,
  ): Promise<planAggregatorResponseDto> {
    const res = await this.checkExisting(req.portfolioid);
    return PlanAggregatorResponseDtoBuilder.builder().of(res).build();
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
  public async expirePlanAggregator(planAggregator: PlanAggregator) {
    const userSubscriptions = await Promise.all(
      planAggregator.userSubscriptionIds.map(async (id) => {
        return await userSubscriptionService.fetchById(id);
      }),
    );

    const expiredSubscription = userSubscriptions.filter(userSub => new Date()> userSub.endDate);

    if(expiredSubscription.length===0){
      return;
    }

  }
}

export default new PlanAggregatorService();
