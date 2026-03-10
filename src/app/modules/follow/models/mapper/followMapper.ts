import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { Follow } from "../../../../entity/followEntity";
import { FollowResponseDto } from "../response/followResponseDto";
import { CreateFollowRequest } from "../request/createFollowRequest";

export const followMapper: MappingProfile=(mapper:Mapper)=>{
    createMap(
        mapper,
        Follow,
        FollowResponseDto
    )

    createMap(
        mapper,
        CreateFollowRequest,
        Follow
    )
}