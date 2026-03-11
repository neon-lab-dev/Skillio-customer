import { AppRequest } from "@neon-lab-dev/platform";

export class UnfollowRequest implements AppRequest{
    followingId!: string;
}