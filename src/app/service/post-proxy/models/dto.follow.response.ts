import { AppResponseData } from "@neon-lab-dev/platform";

export class FollowResponseDto implements AppResponseData{
    _id!:string;
    followerId!:string;
    followingId!:string;
}