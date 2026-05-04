import { AppRequest } from "@neon-lab-dev/platform";
import { addressType, ProfileType } from "../../enums/registrationEnum";
import { Location } from "../../interface/registration.interface";

export class CreateProfileDetailsRequest implements AppRequest{
    firstName?:string;
    lastName?:string;
    groupName?:string;
    nickName!:string;
    profileType!: ProfileType;
    profileId!:string;
    address!:{
        streetAddress: string,
        type: addressType,
        city: string,
        state: string,
        country: string,
        pinCode: number,
        location: Location,
    }[]
}