import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { CreateFollowsRequest } from "../model/request/createFollowsRequest";
import createFollowsRequestValidator from "../validator/createFollowsRequestValidator";
import followService from "../followService";

export class CreateFollowsApi implements Api<CreateFollowsRequest , AppResponse>{
    async preprocess(req: CreateFollowsRequest):  Promise<void> | never {
        await createFollowsRequestValidator.validate(req);
    }

    async process(req: CreateFollowsRequest): Promise<AppResponse> {
        const res= await followService.create(req);

        return{
            status:HTTP_STATUS.CREATED,
            message: RESPONSE_MESSAGES.CREATED,
            data: res
        }
    }
}