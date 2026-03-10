import { Privacy } from "../../../../entity/privacy";
import { globalMapper } from "../../../../mapper.global";
import { PrivacyDto } from "../response/privacyDto";

export class PrivacyDtoBuilder{
    private dto: PrivacyDto;

    private constructor(){
        this.dto= new PrivacyDto()
    }

    public static builder():PrivacyDtoBuilder{
        return new PrivacyDtoBuilder();
    }

    public of(entity: Privacy):PrivacyDtoBuilder{
        this.dto= globalMapper.map(entity  , Privacy, PrivacyDto);
        this.dto.id= entity.id;
        this.dto.type= entity.type; 
        return this;
    }

    public build():PrivacyDto{
        return this.dto;
    }
}