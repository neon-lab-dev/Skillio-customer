import { AppRequest } from "@neon-lab-dev/platform";

export class FetchUserReachRequest implements AppRequest{
    userReferenceId!:string;
}