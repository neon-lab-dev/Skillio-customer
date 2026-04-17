import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { CheckIfPinSetRequest } from "../models/request/checkIfPinSetRequest";
import checkIfPinSetValidator from "../validators/checkIfPinSetValidator";
import registrationServices from "../registration.services";

export class CheckIfPinSetApi implements Api<CheckIfPinSetRequest , AppResponse>{
    async preprocess(req: CheckIfPinSetRequest):  Promise<void> | never {
        await checkIfPinSetValidator.validate(req);
    }

    async process(req: CheckIfPinSetRequest): Promise<AppResponse> {
        const res= await registrationServices.checkIfPinSet(req);

        return{
            status:HTTP_STATUS.SUCCESS,
            message:RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}