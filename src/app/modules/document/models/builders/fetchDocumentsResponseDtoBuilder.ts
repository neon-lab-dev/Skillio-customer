import { Document } from "../../../../entity/documentEntity";
import { globalMapper } from "../../../../mapper.global";
import { FetchDocumentsResponseDto } from "../response/fetchDocumentsResponseDto";

export class FetchDocumentsResponseDtoBuilder{
    private dto: FetchDocumentsResponseDto;

    constructor(){
        this.dto= new FetchDocumentsResponseDto;
    }

    public static builder():FetchDocumentsResponseDtoBuilder{
        return new FetchDocumentsResponseDtoBuilder();
    }

    private of(entity: Document): FetchDocumentsResponseDtoBuilder{
        this.dto= globalMapper.map(entity , Document , FetchDocumentsResponseDto);
        this.dto.id= entity.id;
        return this;
    }

    private build(): FetchDocumentsResponseDto{
        return this.dto;
    }

    public ofArray(entities: Document[]): FetchDocumentsResponseDto[]{
        return entities.map((entity)=> FetchDocumentsResponseDtoBuilder.builder().of(entity).build())
    }
}