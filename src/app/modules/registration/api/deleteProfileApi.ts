import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { DeleteProfileRequest } from "../models/request/deleteProfileRequest";
import deleteProfileValidator from "../validators/deleteProfileValidator";
import registrationServices from "../registration.services";

export class DeleteProfileApi implements Api<DeleteProfileRequest, AppResponse>{
    async preprocess(req: DeleteProfileRequest): Promise<void> | never {
        await deleteProfileValidator.validate(req);
    }

    async process(req: DeleteProfileRequest): Promise<AppResponse> {
        await registrationServices.delete(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.DELETED
        }
    }
}