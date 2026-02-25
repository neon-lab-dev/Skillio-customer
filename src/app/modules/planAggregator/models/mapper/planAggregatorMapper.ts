import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { PlanAggregator } from "../../../entity/planAggregator";
import { planAggregatorResponseDto } from "../response/PlanAggregatorResponseDto";
import { PlanAggregatorRequestDto } from "../request/planAggregatorRequestDto";

export const planAggregatorMapper:MappingProfile=(mapper:Mapper)=>{
    createMap(
        mapper,
        PlanAggregator,
        planAggregatorResponseDto
    )

    createMap(
        mapper,
        PlanAggregatorRequestDto,
        PlanAggregator
    )
}