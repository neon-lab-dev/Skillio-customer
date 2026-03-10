import { AutoMap } from "@automapper/classes";
import { AppResponseData } from "@neon-lab-dev/platform";

export class FollowResponseDto implements AppResponseData{
    @AutoMap()
    followerId!: string;

    @AutoMap()
    followingId!: string;

}