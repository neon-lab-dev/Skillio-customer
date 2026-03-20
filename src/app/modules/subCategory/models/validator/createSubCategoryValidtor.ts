import { Validator, HTTP_STATUS } from "@neon-lab-dev/platform";
import { CreateSubCategoryRequest } from "../request/createSubCategoryRequest";
import { createSubCategorySchema } from "../schema/subCategorySchema";
import { CategoryRepository } from "../../../category/repository/category.repository";
import { SubCategoryRepository } from "../../repository/subCategory.repository";
class CreateSubCategoryValidator implements Validator {
    private categoryRepository = new CategoryRepository();
    private subCategoryRepository = new SubCategoryRepository();
    async validate(req: CreateSubCategoryRequest): Promise<void> | never {
        createSubCategorySchema.parse(req);


        const category = await this.categoryRepository.findById(req.categoryId);

        if (!category) {
            const error = new Error("Category not found") as any;
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        const exists = await this.subCategoryRepository.findByNameAndCategoryId(req.name, req.categoryId);
        if (exists) {
            const error = new Error("SubCategory already exists") as any;
            error.status = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }
    }
}

export default new CreateSubCategoryValidator();