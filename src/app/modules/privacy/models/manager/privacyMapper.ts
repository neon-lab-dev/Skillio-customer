import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { Privacy } from "../../../../entity/privacy";
import { PrivacyDto } from "../response/privacyDto";

export const privacyMapper: MappingProfile=(mapper: Mapper)=>{
    createMap(
        mapper,
        Privacy,
        PrivacyDto
    )
}