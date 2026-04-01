import { Validator } from "@neon-lab-dev/platform";
import { CreateSubCategoryRequest } from "../request/createSubCategoryRequest";
import { createSubCategorySchema } from "../schema/subCategorySchema";

class CreateSubCategoryValidator implements Validator {

    async validate(req: CreateSubCategoryRequest): Promise<void> | never {
        createSubCategorySchema.parse(req);

    }
}

export default new CreateSubCategoryValidator();