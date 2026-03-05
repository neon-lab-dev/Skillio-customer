import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdateProfileRequest } from "../models/request/updateProfileRequest";
import updateProfileRequestValidator from "../validators/updateProfileRequestValidator";
import registrationServices from "../registration.services";

export class UpdateProfileApi implements Api<UpdateProfileRequest, AppResponse>{
    async preprocess(req: UpdateProfileRequest):  Promise<void> | never {
        await updateProfileRequestValidator.validate(req);
    }

    async process(req: UpdateProfileRequest): Promise<AppResponse> {
        await registrationServices.updateProfile(req);

        return{
            status:HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.UPDATED
        }
    }
}