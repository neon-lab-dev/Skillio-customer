import { FetchProfileDto } from "../dto/dto.fetch.profile";
import { Profile } from "../../../../entity/profile";
import { contactType } from "../../enums/registrationEnum";
import servicePostProxy from "../../../../service/post-proxy/service.post-proxy";

export class FetchProfileDtoBuilder {
    private dto: FetchProfileDto;

    private constructor(){
        this.dto= new FetchProfileDto()
    }

    public static builder(): FetchProfileDtoBuilder{
        return new FetchProfileDtoBuilder()
    }

    public async of(entity: Profile):Promise<FetchProfileDtoBuilder>{
        this.dto.id= entity.id;
        this.dto.nickName= entity.profileDetails?.nickName!;
        this.dto.firstName= entity.profileDetails?.firstName;
        this.dto.lastName= entity.profileDetails?.lastName;
        this.dto.groupName= entity.profileDetails?.groupName;
        this.dto.profileType= entity.profileDetails?.profileType!;
        this.dto.status= entity.profileDetails?.status!;
        this.dto.city= entity.address?.city!;
        this.dto.country= entity.address?.country!;
        this.dto.proficiency= entity.portfolio?.proficiency!;
        this.dto.portfolioId= entity.portfolio?.id!;
        this.dto.eventsDone= entity.portfolio?.totalEvents;
        this.dto.onlineStatus= entity.online?.status;
        this.dto.category= entity.portfolio?.category!;
        this.dto.subCategory= entity.portfolio?.subCategory!;
        this.dto.email= this.ofEmail(entity);
        this.dto.phoneNumber= this.ofPhoneNum(entity);
        this.dto.follows= this.setFollows(entity);
        this.dto.document= this.setDocument(entity);
        await this.setFollowCount(entity.id);

        return this;
    }

    private ofPhoneNum(entity:Profile):(string | undefined)[]{
        return entity.contacts
        .filter(contact => contact.type === contactType.PHONE)
        .map(contact => contact.value);
    }

    private ofEmail(entity: Profile):(string | undefined)[]{
        return entity.contacts
        .filter(contact => contact.type === contactType.EMAIL)
        .map(contact => contact.value);

    }

    private setDocument(entity: Profile){
        return entity.portfolio?.document.map((doc)=>{
            return {
                url: doc.url,
                type: doc.type
            }
        })
    }

    private setFollows(entity: Profile){
        return entity.portfolio?.follows.map((val)=>{
            return {
                socialMedia: val.socialMedia,
                link: val.link,
                followers: val.followers,
                following: val.following
            }
        })
    }

    private  async setFollowCount(profileId: string){
        const userReach= await servicePostProxy.fetchUserReach({userReferenceId: profileId});
        this.dto.userReach={
            followerCount: userReach?.followerCount,
            followingCount: userReach?.followingCount,
            likeCount: userReach?.likeCount,
            reactionCount: userReach?.reactionCount
        }
    }


    public async build(): Promise<FetchProfileDto>{
        return this.dto;
    }

    public async ofArray(entities: Profile[]):Promise<FetchProfileDto[]>{
        return await Promise.all(entities.map(async entity=>(await FetchProfileDtoBuilder.builder().of(entity)).build()))
    }
}