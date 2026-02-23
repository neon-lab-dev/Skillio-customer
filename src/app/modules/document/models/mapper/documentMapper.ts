import { FetchDocumentsResponseDto } from "../response/fetchDocumentsResponseDto";
import { Document } from "../../../../entity/documentEntity";
import { createMap , Mapper ,forMember , mapFrom, MappingProfile } from "@automapper/core";

export const documentMapper: MappingProfile= (mapper: Mapper)=>{

    createMap(
        mapper , 
        Document,
        FetchDocumentsResponseDto,
        forMember(
            dest => dest.type,
            mapFrom(src => src.type)
        )
    )

}