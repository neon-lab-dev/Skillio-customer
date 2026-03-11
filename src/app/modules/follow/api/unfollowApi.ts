import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UnfollowRequest } from "../models/request/unfollowRequest";
import followService from "../followService";
import unfollowValidator from "../validators/unfollowValidator";

export class UnfollowApi implements Api<UnfollowRequest , AppResponse>{
    async preprocess(req: UnfollowRequest): Promise<void> | never {
        await unfollowValidator.validate(req);
    }

    async process(req: UnfollowRequest): Promise<AppResponse> {
        await followService.unfollow(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.DELETED
        }
    }
}