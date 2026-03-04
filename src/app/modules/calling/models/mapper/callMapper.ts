import { createMap, Mapper, MappingProfile } from "@automapper/core";
import { Call } from "../../../../entity/call";
import { FetchCallResponseDto } from "../response/fetchCallResponseDto";


export const callMapper:MappingProfile=(mapper: Mapper)=>{
    createMap(
        mapper,
        Call,
        FetchCallResponseDto
    )
}