import {  AppResponseData } from "@neon-lab-dev/platform";
import { profileStatus, ProfileType } from "../../enums/registrationEnum";

export class FetchProfileDto implements AppResponseData{

    id!: string;
    firstName!: string | undefined;
    lastName!: string | undefined;
    nickName!: string;
    groupName!: string | undefined;
    status!: profileStatus;
    profileType!: ProfileType;
    city!: string;
    country!: string;
    email!: (string | undefined)[];
    phoneNumber!: (string | undefined)[];
    proficiency!: string;


}