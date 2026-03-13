import { AppRequest } from "@neon-lab-dev/platform";

export class FetchFollowRequest implements AppRequest{
    followingId!:string
}