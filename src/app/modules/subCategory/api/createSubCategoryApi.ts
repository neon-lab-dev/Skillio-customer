import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { CreateSubCategoryRequest } from "../models/request/createSubCategoryRequest";
import createSubCategoryValidtor from "../models/validator/createSubCategoryValidtor";
import subCategoryService from "../subCategory.service";

export class CreateSubCategoryApi implements Api<CreateSubCategoryRequest, AppResponse>{
    async preprocess(req: CreateSubCategoryRequest):  Promise<void> | never {
        await createSubCategoryValidtor.validate(req);
    }

    async process(req: CreateSubCategoryRequest): Promise<AppResponse> {
        const res= await subCategoryService.create(req);

        return{
            status:HTTP_STATUS.CREATED,
            message: RESPONSE_MESSAGES.CREATED,
            data: res
        }
    }
}