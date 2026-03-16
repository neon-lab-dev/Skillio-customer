import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { CreateCategoryRequest } from "../models/request/createCategoryRequest";
import createCategoryValidator from "../validator/createCategoryValidator";
import categoryService from "../category.service";

export class CreateCategoryApi implements Api<CreateCategoryRequest , AppResponse>{
    async preprocess(req: CreateCategoryRequest):  Promise<void> | never {
        await createCategoryValidator.validate(req);
    }

    async process(req: CreateCategoryRequest): Promise<AppResponse> {
        const res= await categoryService.create(req);

        return{
            status:HTTP_STATUS.CREATED,
            message:RESPONSE_MESSAGES.CREATED,
            data: res
        }
    }
}