import { AsyncContextService } from "@neon-lab-dev/platform";
import { ProfileDetails } from "../../../../entity/profileDetails";
import { CreateProfileDetailsRequest } from "../request/createProfileDetailsRequest";
import registrationRepository from "../../../../repository/registrationRepository";

export class ProfileDetailsEntityBuilder{
    private entity: ProfileDetails;

    private constructor(){
        this.entity= new ProfileDetails;
    }

    public static builder(){
        return new ProfileDetailsEntityBuilder;
    }

    public async of(req: CreateProfileDetailsRequest):Promise<ProfileDetailsEntityBuilder>{
        this.entity.firstName= req.firstName;
        this.entity.lastName= req.lastName;
        this.entity.groupName = req.groupName;
        this.entity.nickName= req.nickName;
        this.entity.profileType= req.profileType;
        const profileId= AsyncContextService.getUserId() as string;
        this.entity.profileId= profileId;
        await this.updateIsOnboarded(profileId);

        return this;
    }

    private async updateIsOnboarded(porfileId:string){
        await registrationRepository.updateProfile(porfileId , {
            isOnboarded: true
        })
    }

    public build(): ProfileDetails{
        return this.entity;
    }
}