import { Validator, HTTP_STATUS } from "@neon-lab-dev/platform";
import { CreateCategoryRequest } from "../models/request/createCategoryRequest";
import { createCategorySchema } from "../models/schema/categorySchema";
import { CategoryRepository } from "../repository/category.repository";

class CreateCateogryValidator implements Validator {
    private categoryRepository = new CategoryRepository();
    async validate(req: CreateCategoryRequest): Promise<void> | never {
        createCategorySchema.parse(req);
        const exists = await this.categoryRepository.findByName(req.name);

        if (exists) {
            const error = new Error("Category already exists") as any;
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }
    }
}

export default new CreateCateogryValidator();