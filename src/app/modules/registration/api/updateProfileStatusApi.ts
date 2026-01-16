import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdateProfileStatusRequest } from "../models/request/updateProfileStatusRequest";
import { AppResponse } from "@neon-lab-dev/platform";
import updatProfileStatusValidator from "../validators/updatProfileStatusValidator";
import registrationServices from "../registration.services";

class UpdateProfileStatusApi implements Api<UpdateProfileStatusRequest , AppResponse>{
    async preprocess(req: UpdateProfileStatusRequest):  Promise<void> | never {
        await updatProfileStatusValidator.validate(req);
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