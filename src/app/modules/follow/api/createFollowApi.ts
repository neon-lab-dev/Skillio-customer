import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { CreateFollowRequest } from "../models/request/createFollowRequest";
import createFollowValidator from "../validators/createFollowValidator";
import followService from "../followService";

export class CreateFollowApi implements Api<CreateFollowRequest, AppResponse>{
    async preprocess(req: CreateFollowRequest): Promise<void> | never {
        await createFollowValidator.validate(req);
    }

    async process(req: CreateFollowRequest): Promise<AppResponse> {
        const res= await followService.create(req);

        return{
            status:HTTP_STATUS.CREATED,
            message: RESPONSE_MESSAGES.CREATED,
            data: res
        }
    }
}