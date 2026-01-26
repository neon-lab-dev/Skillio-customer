import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdateProfileStatusRequest } from "../models/request/updateProfileStatusRequest";
import { AppResponse } from "@neon-lab-dev/platform";
import registrationServices from "../registration.services";
import updateProfileStatusValidator from "../validators/updateProfileStatusValidator";

class UpdateProfileStatusApi implements Api<UpdateProfileStatusRequest , AppResponse>{
    async preprocess(req: UpdateProfileStatusRequest):  Promise<void> | never {
        await updateProfileStatusValidator.validate(req);
    }

    async process(req: UpdateProfileStatusRequest): Promise<AppResponse> {
        await registrationServices.updateProfileStatus(req);
        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.UPDATED
        }
    }
}

export default new UpdateProfileStatusApi()