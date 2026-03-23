import { Api, AppResponse, HTTP_STATUS, Loggable, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { TokenRequest } from "../models/request/tokenRequet";
import tokenService from "../service/tokenService";

export class CreateOrUpdateApi implements Api<TokenRequest, AppResponse>{
    @Loggable()
    async preprocess(req: TokenRequest):  Promise<void> | never {
        
    }

    @Loggable()
    async process(req: TokenRequest): Promise<AppResponse> {
        const res= await tokenService.createOrUpdate(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}