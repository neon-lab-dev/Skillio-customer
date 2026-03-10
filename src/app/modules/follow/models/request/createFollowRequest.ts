import { AutoMap } from "@automapper/classes";
import { AppRequest } from "@neon-lab-dev/platform";

export class CreateFollowRequest implements AppRequest{
    @AutoMap()
    followingId!: string;
}