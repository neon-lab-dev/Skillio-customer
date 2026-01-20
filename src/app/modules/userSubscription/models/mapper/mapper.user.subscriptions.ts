import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { PlanMasterDetailsDto } from "../../../planMaster/models/response/dto.plan.master.details";
import { PlanDetails } from "../dto/dto.plan.details";


export const userSubscriptionMapperProfile: MappingProfile = (mapper: Mapper) => {

    createMap(
        mapper,
        PlanMasterDetailsDto,
        PlanDetails
    );

}