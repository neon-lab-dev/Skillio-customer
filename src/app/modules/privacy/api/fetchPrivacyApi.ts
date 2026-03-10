import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchPrivacyRequest } from "../models/request/fetchPrivacyRequest";
import privacyService from "../privacyService";

export class FetchPrivacyApi implements Api<FetchPrivacyRequest, AppResponse>{
    async preprocess(req: FetchPrivacyRequest):  Promise<void> | never {
        
    }

    async process(req: FetchPrivacyRequest): Promise<AppResponse> {
        const res= await privacyService.fetch(req);

        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}