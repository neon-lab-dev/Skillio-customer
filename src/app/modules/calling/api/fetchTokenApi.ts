import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchTokenRequest } from "../models/request/fetchTokenRequest";
import { AppResponse } from "@neon-lab-dev/platform";
import fetchTokenValidator from "../validators/fetchTokenValidator";
import callService from "../call.service";

export class FetchTokenApi implements Api<FetchTokenRequest , AppResponse>{
    async preprocess(req: FetchTokenRequest): Promise<void> | never {
        await fetchTokenValidator.validate(req)
    }

    async process(req: FetchTokenRequest): Promise<AppResponse> {
        const res= await callService.getToken(req);

        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}