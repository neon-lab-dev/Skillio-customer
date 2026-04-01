import { Validator } from "@neon-lab-dev/platform";
import { CreateCategoryRequest } from "../models/request/createCategoryRequest";
import { createCategorySchema } from "../models/schema/categorySchema";

class CreateCateogryValidator implements Validator {
   
    async validate(req: CreateCategoryRequest): Promise<void> | never {
            createCategorySchema.parse(req);
    }
}

export default new CreateCateogryValidator();