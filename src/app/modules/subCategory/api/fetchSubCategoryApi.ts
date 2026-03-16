import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchSubCategoryRequest } from "../models/request/fetchSubCategoryRequest";
import subCategoryService from "../subCategory.service";
import fetchSubCategoryValidator from "../models/validator/fetchSubCategoryValidator";

export class FetchSubCategoryApi implements Api<FetchSubCategoryRequest, AppResponse>{
    async preprocess(req: FetchSubCategoryRequest):  Promise<void> | never {
        await fetchSubCategoryValidator.validate(req);
    }

    async process(req: FetchSubCategoryRequest): Promise<AppResponse> {
        const res= await subCategoryService.fetch(req);

        return{
            status:HTTP_STATUS.SUCCESS,
            message:RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}