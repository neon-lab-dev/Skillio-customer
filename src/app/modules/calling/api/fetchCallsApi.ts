import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchCallsRequest } from "../models/request/fetchCallsRequest";
import fetchCallsValidator from "../validators/fetchCallsValidator";
import callService from "../call.service";

export class FetchCallsApi implements Api<FetchCallsRequest , AppResponse>{
    async preprocess(req: FetchCallsRequest):  Promise<void> | never {
        await fetchCallsValidator.validate(req);
    }

    async process(req: FetchCallsRequest): Promise<AppResponse> {
        const res= await callService.fetchCalls(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}