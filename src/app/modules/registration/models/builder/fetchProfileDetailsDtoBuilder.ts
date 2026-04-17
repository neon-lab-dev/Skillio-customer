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
        this.dto.firstName= entity.profileDetails?.firstName;
        this.dto.lastName= entity.profileDetails?.lastName;
        this.dto.nickName= entity.profileDetails?.nickName!;
        this.dto.groupName= entity.profileDetails?.groupName;
        this.dto.isSubscribed= entity.isSubscribed;
        this.dto.profileType= entity.profileDetails?.profileType!;
        this.dto.status= entity.profileDetails?.status!;
        this.dto.createdAt= entity.createdAt;
        this.dto.updatedAt= entity.updatedAt;
        this.dto.portfolio= entity.portfolio!;
        return this;
    }

    public build(): FetchProfileDetailsResponseDto{
        return this.dto;
    }
}