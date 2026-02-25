import { globalMapper } from "../../../../mapper.global";
import { PlanAggregator } from "../../../entity/planAggregator";
import { planAggregatorResponseDto } from "../response/PlanAggregatorResponseDto";

export class PlanAggregatorResponseDtoBuilder{
    private dto: planAggregatorResponseDto;

    private constructor(){
        this.dto= new planAggregatorResponseDto()
    }

    public static builder():PlanAggregatorResponseDtoBuilder{
        return new PlanAggregatorResponseDtoBuilder()
    }

    public of(entity: PlanAggregator):PlanAggregatorResponseDtoBuilder{
        this.dto= globalMapper.map(entity , PlanAggregator , planAggregatorResponseDto)
        return this;
    }

    public build():planAggregatorResponseDto{
        return this.dto;
    }
}