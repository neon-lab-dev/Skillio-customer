import { Loggable, NotFoundError } from "@neon-lab-dev/platform";
import { PlanAggregator } from "../entity/planAggregator";
import { ProfileVisibility } from "../planMaster/enum/ProfileVisibility";
import { FetchPlanAggregatorRequestDto } from "./models/request/fetchPlanAggregatorRequestDto";
import { PlanAggregatorRequestDto } from "./models/request/planAggregatorRequestDto";
import { planAggregatorResponseDto } from "./models/response/PlanAggregatorResponseDto";
import { PlanAggregatorRepository } from "./repository/planAggregatorRepository";
import { PlanAggregatorResponseDtoBuilder } from "./models/builder/planAggregatorResponseDtoBuilder";

class PlanAggregatorService{
    private repository: PlanAggregatorRepository=  new PlanAggregatorRepository();

    private merge(existing: PlanAggregator , req: PlanAggregatorRequestDto){
        const updated= {
            callLimtis: existing.callLimits+ req.callLimits,
            chatLimits: existing.chatLimits+ req.chatLimits,
            profileVisibility: existing.profileVisibility===ProfileVisibility.ONE?existing.profileVisibility: req.profileVisibility,
            planIds: [...existing.planIds , req.planId],
            activePlans: existing.acitvePlans+1
        }
        return updated;
    }

    private project(req: PlanAggregatorRequestDto){
        const planAggregator={
            callLimits: req.callLimits,
            chatLimits: req.chatLimits,
            profileVisibility: req.profileVisibility,
            planIds: [req.planId],
            activePlans: 1
        }
        return planAggregator;
    }

    @Loggable()
    public async aggregate(req: PlanAggregatorRequestDto , portfolioId: string){
        const existingPlanAggregator=await this.repository.findByPortfolioId(portfolioId);
        const updated= existingPlanAggregator? this.merge(existingPlanAggregator , req): this.project(req)
        await this.upsert(updated , portfolioId)
    }

    @Loggable()
    private async upsert(planAggregator: Partial<PlanAggregator> , portfolioId:string){
         await this.repository.upsert(planAggregator ,portfolioId );
    }

    @Loggable()
    public async fetch(req: FetchPlanAggregatorRequestDto):Promise<planAggregatorResponseDto>{
        const res = await this.repository.findByPortfolioId(req.portfolioid);
        if(!res){
            throw new NotFoundError("plan aggregator not found")
        }
        return PlanAggregatorResponseDtoBuilder.builder().of(res).build();
    }
}

export default new PlanAggregatorService()