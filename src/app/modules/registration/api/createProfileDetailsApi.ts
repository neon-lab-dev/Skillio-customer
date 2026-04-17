import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { CreateProfileDetailsRequest } from "../models/request/createProfileDetailsRequest";
import createProfileDetailsValidator from "../validators/createProfileDetailsValidator";
import registrationServices from "../registration.services";

export class CreateProfileDetailsApi implements Api<CreateProfileDetailsRequest , AppResponse>{
    async preprocess(req: CreateProfileDetailsRequest):  Promise<void> | never {
        await createProfileDetailsValidator.validate(req);
    }

    async process(req: CreateProfileDetailsRequest): Promise<AppResponse> {
        const res= await registrationServices.createProfileDetails(req);

        return{
            status: HTTP_STATUS.CREATED,
            message:RESPONSE_MESSAGES.CREATED,
            data: res
        }
    }
}