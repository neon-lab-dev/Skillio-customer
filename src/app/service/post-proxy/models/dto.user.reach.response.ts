import { AppResponseData } from "@neon-lab-dev/platform";
import { Expose } from "class-transformer";

export class UserReachResponseDto implements AppResponseData{
    @Expose()
    followerCount!:number;
    
    @Expose()
    followingCount!: number;

    @Expose()
    likeCount!: number;

    @Expose()
    reactionCount!: number;

    @Expose()
    viewsCount!: number;
}