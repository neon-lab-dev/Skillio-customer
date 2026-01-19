import { FetchProfileDto } from "../dto/dto.fetch.profile";
import { Profile } from "../../../../entity/profile";
import { contactType } from "../../enums/registrationEnum";

export class FetchProfileDtoBuilder {
    private dto: FetchProfileDto;

    private constructor(){
        this.dto= new FetchProfileDto()
    }

    public static builder(): FetchProfileDtoBuilder{
        return new FetchProfileDtoBuilder()
    }

    public of(entity: Profile):FetchProfileDtoBuilder{
        this.dto.id= entity.id;
        this.dto.nickName= entity.nickName;
        this.dto.firstName= entity.firstName;
        this.dto.lastName= entity.lastName;
        this.dto.groupName= entity.groupName;
        this.dto.profileType= entity.profileType;
        this.dto.status= entity.status;
        this.dto.city= entity.address.city;
        this.dto.country= entity.address.country;
        this.dto.proficiency= entity.portfolio.proficiency;
        this.dto.email= this.ofEmail(entity);
        this.dto.phoneNumber= this.ofPhoneNum(entity);

        return this;
    }

    private ofPhoneNum(entity:Profile):(string | undefined)[]{
        const phoneNum= entity.contacts.map((contact=>{
            if(contact.type=== contactType.PHONE){
                return contact.value;
            }
        }))
        return phoneNum;
    }

    private ofEmail(entiy: Profile):(string | undefined)[]{
        const email= entiy.contacts.map((contact=>{
            if(contact.type=== contactType.EMAIL){
                return contact.value;
            }
        }))
        return email;
    }

    public build(): FetchProfileDto{
        return this.dto;
    }

    public ofArray(entities: Profile[]):FetchProfileDto[]{
        return entities.map(entity=> FetchProfileDtoBuilder.builder().of(entity).build())
    }
}