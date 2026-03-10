import { Follow } from "../../../../entity/followEntity";
import { globalMapper } from "../../../../mapper.global";
import { FollowResponseDto } from "../response/followResponseDto";

export class FollowResponseDtoBuilder{
    private dto:FollowResponseDto;

    private constructor(){
        this.dto= new FollowResponseDto()
    }

    public static builder():FollowResponseDtoBuilder{
        return new FollowResponseDtoBuilder()
    }

    public of(entity: Follow ):FollowResponseDtoBuilder{
        this.dto= globalMapper.map(entity , Follow, FollowResponseDto);
        return this;
    }

    public build(): FollowResponseDto{
        return this.dto;
    }

    public ofArray(entities: Follow[]):FollowResponseDto[]{
        return entities.map((entity)=> FollowResponseDtoBuilder.builder().of(entity).build());
    }
}