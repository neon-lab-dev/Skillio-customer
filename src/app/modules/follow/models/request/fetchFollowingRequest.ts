import { AppRequest } from "@neon-lab-dev/platform";

export class FetchFollowingRequest implements AppRequest{

    page?:string;

    perPage?:string;

}