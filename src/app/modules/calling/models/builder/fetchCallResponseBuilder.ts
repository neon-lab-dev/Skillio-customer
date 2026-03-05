import { Call } from "../../../../entity/call";
import { globalMapper } from "../../../../mapper.global";
import { status } from "../../enums/callEnum";
import { FetchCallResponseDto } from "../response/fetchCallResponseDto";

export class FetchCallResponseBuilder {
    private dto: FetchCallResponseDto;

    private constructor(){
        this.dto= new FetchCallResponseDto()
    }

    public static builder():FetchCallResponseBuilder{
        return new FetchCallResponseBuilder()
    }

    public of(entity:Call): FetchCallResponseBuilder{
        this.dto= globalMapper.map(entity , Call , FetchCallResponseDto);
        this.dto.duration= this.setDuration(entity.callStatus,entity.startedAt , entity.endedAt);
        return this;
    }

    private setDuration(callStatus:status ,startedAt: Date , endedAt: Date | undefined):number{
        if(callStatus!= status.ENDED){
            return 0;
        }
        const duration= endedAt!.getTime() - startedAt.getTime();
        return duration/1000;
    }

    public build():FetchCallResponseDto{
        return this.dto;
    }

    public ofArray(entities: Call[]):FetchCallResponseDto[]{
        return entities.map((entity)=> FetchCallResponseBuilder.builder().of(entity).build());
    }
}