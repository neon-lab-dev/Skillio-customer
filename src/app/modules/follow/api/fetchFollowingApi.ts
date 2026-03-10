import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import followService from "../followService";
import { FetchFollowingRequest } from "../models/request/fetchFollowingRequest";

export class FetchFollowingApi implements Api<FetchFollowingRequest, AppResponse>{
    async preprocess(req: FetchFollowingRequest):  Promise<void> | never {
        
    }

    async process(req: FetchFollowingRequest): Promise<AppResponse> {
        const res= await followService.fetchFollowing(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}