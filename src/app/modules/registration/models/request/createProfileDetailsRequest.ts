import { AppRequest } from "@neon-lab-dev/platform";
import { ProfileType } from "../../enums/registrationEnum";

export class CreateProfileDetailsRequest implements AppRequest{
    firstName?:string;
    lastName?:string;
    groupName?:string;
    nickName!:string;
    profileType!: ProfileType
}