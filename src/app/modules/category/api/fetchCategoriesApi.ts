import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchCategoriesRequest } from "../models/request/fetchCategoriesRequest";
import categoryService from "../category.service";

export class FetchCategoriesApi implements Api<FetchCategoriesRequest  , AppResponse>{
    async preprocess(req: FetchCategoriesRequest): Promise<void> | never {
        
    }

    async process(req: FetchCategoriesRequest): Promise<AppResponse> {
        const res= await categoryService.fetch(req);

        return{
            status:HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}