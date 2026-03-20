import {  Validator } from "@neon-lab-dev/platform";
import { FetchSubCategoryRequest } from "../request/fetchSubCategoryRequest";
import { fetchSubCategorySchema } from "../schema/subCategorySchema";
import { CategoryRepository } from "../../../category/repository/category.repository";

class FetchSubCategoryValidtor implements Validator{
      private categoryRepository = new CategoryRepository();
    async validate(req: FetchSubCategoryRequest): Promise<void> | never {
        fetchSubCategorySchema.parse(req);

        const category=await this.categoryRepository.findById(req.categoryId);

        if(!category){
            throw new Error("Category not found");
        }
    }
}

export default new FetchSubCategoryValidtor();