import { AutoMap } from "@automapper/classes";
import { AppResponseData } from "@neon-lab-dev/platform";

export class UserReachResponseDto implements AppResponseData{
    @AutoMap()
    followerCount!:number;

    @AutoMap()
    followingCount!:number;
}