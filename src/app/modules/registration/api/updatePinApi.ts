import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdatePinRequest } from "../models/request/updatePinRequest";
import updatePinValidator from "../validators/updatePinValidator";
import registrationServices from "../registration.services";

export class UpdatePinApi implements Api<UpdatePinRequest , AppResponse>{
    async preprocess(req: UpdatePinRequest):  Promise<void> | never {
        await updatePinValidator.validate(req);
    }

    async process(req: UpdatePinRequest): Promise<AppResponse> {
        await registrationServices.updatePin(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.UPDATED
        }
    }
}