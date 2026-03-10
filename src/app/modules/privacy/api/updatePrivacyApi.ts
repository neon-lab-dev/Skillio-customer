import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdatePrivacyRequest } from "../models/request/updatePrivacyRequest";
import updatePrivacyValidator from "../validator/updatePrivacyValidator";
import privacyService from "../privacyService";

export class UpdatePrivacyApi implements Api<UpdatePrivacyRequest, AppResponse>{
    async preprocess(req: UpdatePrivacyRequest):  Promise<void> | never {
       await updatePrivacyValidator.validate(req);
    }

    async process(req: UpdatePrivacyRequest): Promise<AppResponse> {
        await privacyService.update(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.UPDATED
        }
    }
}