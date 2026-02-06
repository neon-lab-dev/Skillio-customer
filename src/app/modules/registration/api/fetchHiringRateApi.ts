import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import fetchHiringRateValidator from "../validators/fetchHiringRateValidator";
import { FetchHiringRateRequest } from "../models/request/fetchHiringRateRequest";
import { AppResponse } from "@neon-lab-dev/platform";
import registrationServices from "../registration.services";

export class FetchHiringRateApi implements Api<FetchHiringRateRequest , AppResponse>{
    async preprocess(req: FetchHiringRateRequest): Promise<void> | never {
        fetchHiringRateValidator.validate(req);
    }

    async process(req: FetchHiringRateRequest): Promise<AppResponse> {
        const res=await registrationServices.fetchHiringRate(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}