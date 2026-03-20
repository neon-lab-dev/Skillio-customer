import {  Validator } from "@neon-lab-dev/platform";
import { CreateSubCategoryRequest } from "../request/createSubCategoryRequest";
import { createSubCategorySchema } from "../schema/subCategorySchema";
import { CategoryRepository } from "../../../category/repository/category.repository";
import { SubCategoryRepository } from "../../repository/subCategory.repository";
class CreateSubCategoryValidator implements Validator{
    private categoryRepository = new CategoryRepository();
    private subCategoryRepository = new SubCategoryRepository();
    async validate(req: CreateSubCategoryRequest): Promise<void> | never {
        createSubCategorySchema.parse(req);


            const category=await this.categoryRepository.findById(req.categoryId);

            if(!category){
                throw new Error("Category not found");
            }

                const exists=await this.subCategoryRepository.findByNameAndCategoryId(req.name, req.categoryId);    
                if(exists){
                    throw new Error("SubCategory already exists");
                }
    }
}

export default new CreateSubCategoryValidator();