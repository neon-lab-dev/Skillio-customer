import { PlanAggregator } from "../../../entity/planAggregator";
import { PlanAggregatorInterface } from "../interface/planAggregatorInterface";

export class PlanAggregatorEntityBuilder {
    private entity: PlanAggregator;

    private constructor(){
        this.entity= new PlanAggregator()
    }

    public static builder():PlanAggregatorEntityBuilder{
        return new PlanAggregatorEntityBuilder()
    }

    public of(req: PlanAggregatorInterface):PlanAggregatorEntityBuilder{
        this.entity.callLimits= req.callLimits;
        this.entity.chatLimits= req.chatLimits;
        this.entity.activePlans= req.activePlans;
        this.entity.userSubscriptionIds= req.userSubscriptionIds;
        this.entity.profileId=req.profileId;
        return this;
    }

    public build():PlanAggregator{
        return this.entity;
    }
}