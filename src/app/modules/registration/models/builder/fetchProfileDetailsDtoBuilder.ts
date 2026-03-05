import { Profile } from "../../../../entity/profile";
import { FetchProfileDetailsResponseDto } from "../dto/dto.fetch.profile.details";

export class FetchProfileDetailsDtoBuilder{
    private dto: FetchProfileDetailsResponseDto;

    private constructor(){
        this.dto= new FetchProfileDetailsResponseDto();
    }

    public static builder(): FetchProfileDetailsDtoBuilder{
        return new FetchProfileDetailsDtoBuilder();
    }

    public of(entity: Profile):FetchProfileDetailsDtoBuilder{
        this.dto.firstName= entity.firstName;
        this.dto.lastName= entity.lastName;
        this.dto.nickName= entity.nickName;
        this.dto.groupName= entity.groupName;
        this.dto.isSubscribed= entity.isSubscribed;
        this.dto.profileType= entity.profileType;
        this.dto.status= entity.status;
        this.dto.createdAt= entity.createdAt;
        this.dto.updatedAt= entity.updatedAt;
        this.dto.portfolio= entity.portfolio;
        return this;
    }

    public build(): FetchProfileDetailsResponseDto{
        return this.dto;
    }
}