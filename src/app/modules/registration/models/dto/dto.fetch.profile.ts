import {  AppResponseData } from "@neon-lab-dev/platform";
import { onlineStatus, profileStatus, ProfileType, SocialMeida } from "../../enums/registrationEnum";
import { DocumentType } from "../../../document/enums/documentEnum";

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
    portfolioId!: string;
    eventsDone?:number;
    onlineStatus?: onlineStatus;
    category!:string;
    subCategory!: string;
    follows?:{
        socialMedia: SocialMeida,
        link: string,
        followers?: number,
        following?:number
    }[]
    document!:{
        url:string,
        type: DocumentType
    }[] | undefined
    userReach?:{
        followerCount?:number,
        followingCount?: number,
        likeCount?:number,
        reactionCount?:number;
    }
}