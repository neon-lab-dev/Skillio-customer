import { createMap, forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { PlanMasterDetailsDto } from "../../../planMaster/models/response/dto.plan.master.details";
import { PlanDetails } from "../dto/dto.plan.details";
import { UserSubscriptionEntity } from "../../../entity/UserSubscriptionEntity";
import { PlanMasterEntity } from "../../../entity/PlanMasterEntity";
import { UserSubscriptionResponse } from "../response/response.user.subscription";
import { PaymentResponseDto } from "../../../../service/payment-proxy/models/dto.payment.response";


export const userSubscriptionMapperProfile: MappingProfile = (mapper: Mapper) => {

    createMap(
        mapper,
        PlanMasterEntity,
        PlanDetails
    );

    createMap(
        mapper,
        PlanMasterDetailsDto,
        PlanDetails
    );

    createMap(
        mapper,
        UserSubscriptionEntity,
        UserSubscriptionResponse
    );

    createMap(
        mapper,
        Object,
        PaymentResponseDto
    );

}