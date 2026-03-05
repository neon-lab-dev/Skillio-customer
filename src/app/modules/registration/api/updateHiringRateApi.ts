import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UpdateHiringRateRequest } from "../models/request/updateHiringRateRequest";
import updateHiringRateValidator from "../validators/updateHiringRateValidator";
import registrationServices from "../registration.services";

export class UpdateHiringRateApi implements Api<UpdateHiringRateRequest , AppResponse>{
    async preprocess(req: UpdateHiringRateRequest):  Promise<void> | never {
        await updateHiringRateValidator.validate(req);
    }

    async process(req: UpdateHiringRateRequest): Promise<AppResponse> {
        await registrationServices.updateHiringRate(req);

        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.UPDATED
        }
    }
}