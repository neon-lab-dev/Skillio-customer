import { Api, AppResponse, HTTP_STATUS } from "@neon-lab-dev/platform";
import { ForgotPinRequest } from "../models/request/forgotPinRequest";
import forgotPinValidator from "../validators/forgotPinValidator";
import registrationServices from "../registration.services";

export class ForgotPinApi implements Api<ForgotPinRequest , AppResponse>{
    async preprocess(req: ForgotPinRequest):  Promise<void> | never {
        await forgotPinValidator.validate(req);
    }

    async process(req: ForgotPinRequest): Promise<AppResponse> {
        await registrationServices.forgotPin(req);
        return{
            status:HTTP_STATUS.SUCCESS,
            message: "pin updated successfullly"
        }
    }
}