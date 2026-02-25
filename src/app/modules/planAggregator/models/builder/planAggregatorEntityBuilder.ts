import { globalMapper } from "../../../../mapper.global";
import { PlanAggregator } from "../../../entity/planAggregator";
import { PlanAggregatorRequestDto } from "../request/planAggregatorRequestDto";

export class PlanAggregatorEntityBuilder {
    private entity: PlanAggregator;

    private constructor(){
        this.entity= new PlanAggregator()
    }

    public static builder():PlanAggregatorEntityBuilder{
        return new PlanAggregatorEntityBuilder()
    }

    public of(req: PlanAggregatorRequestDto):PlanAggregatorEntityBuilder{
        this.entity= globalMapper.map(req , PlanAggregatorRequestDto , PlanAggregator);
        return this;
    }

    public build():PlanAggregator{
        return this.entity;
    }
}