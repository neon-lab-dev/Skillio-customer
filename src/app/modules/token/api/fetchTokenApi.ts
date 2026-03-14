import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { TokenRequest } from "../models/request/tokenRequet";
import tokenService from "../service/tokenService";

export class FetchTokenApi implements Api<TokenRequest, AppResponse>{
    async preprocess(req: TokenRequest):  Promise<void> | never {
        
    }

    async process(req: TokenRequest): Promise<AppResponse> {
        const res= await tokenService.fetchByUserId(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}