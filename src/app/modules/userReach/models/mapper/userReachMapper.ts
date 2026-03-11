import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { UserReach } from "../../../../entity/userReach";
import { UserReachResponseDto } from "../response/userReachResponseDto";

export const userReachMapper: MappingProfile=(mapper: Mapper)=>{
    createMap(
        mapper,
        UserReach,
        UserReachResponseDto
    )
}