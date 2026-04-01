import { Loggable, AppValidationError, NotFoundError, ERROR_CODES } from "@neon-lab-dev/platform";
import { SubCategoryRepository } from "./repository/subCategory.repository";
import { CreateSubCategoryRequest } from "./models/request/createSubCategoryRequest";
import { SubCategory } from "../../entity/subCategory";
import { SubCategoryEntityBuilder } from "./models/builder/subCategoryEntityBuilder";
import { FetchSubCategoryRequest } from "./models/request/fetchSubCategoryRequest";
import CategoryService from "../category/category.service";
class SubCategoryService {
    private repository: SubCategoryRepository = new SubCategoryRepository();

    private async checkIfSubCategoryExists(
        name: string,
        categoryId: string
    ): Promise<void> {
        const exists = await this.repository.findByNameAndCategoryId(name, categoryId);
        if (exists) {
            throw new AppValidationError(
                "SubCategory already exists",
                ERROR_CODES.DUPLICATE_ENTRY
            );
        }
    }

    @Loggable()
    public async create(req: CreateSubCategoryRequest): Promise<SubCategory> {
        await CategoryService.checkIfCategoryExistsById(req.categoryId);
        await this.checkIfSubCategoryExists(req.name, req.categoryId);
        const entity = SubCategoryEntityBuilder.builder().of(req).build();

        return this.repository.create(entity);
    }

    @Loggable()
    public async fetch(req: FetchSubCategoryRequest): Promise<SubCategory[]> {
        await CategoryService.checkIfCategoryExistsById(req.categoryId);
        return this.repository.findByCategoryId(req.categoryId);
    }
}

export default new SubCategoryService()