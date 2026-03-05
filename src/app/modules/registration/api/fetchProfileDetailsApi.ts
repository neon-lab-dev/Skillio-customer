import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchProfileDetailsRequest } from "../models/request/fetchProfileDetailsRequest";
import fetchProfileDetailsValidator from "../validators/fetchProfileDetailsValidator";
import registrationServices from "../registration.services";

export class FetchProfileDetailsApi implements Api<FetchProfileDetailsRequest,AppResponse>{
    async preprocess(req: FetchProfileDetailsRequest):  Promise<void> | never {
        await fetchProfileDetailsValidator.validate(req);
    }

    async process(req: FetchProfileDetailsRequest): Promise<AppResponse> {
        const res= await registrationServices.getProfileDetails(req);

        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}