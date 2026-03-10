import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchCountRequest } from "../models/request/fetchCountRequest";
import followService from "../followService";

export class FetchCountApi implements Api<FetchCountRequest , AppResponse>{
    async preprocess(req: FetchCountRequest):  Promise<void> | never {
        
    }

    async process(req: FetchCountRequest): Promise<AppResponse> {
        const res= await followService.fetchCount(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}