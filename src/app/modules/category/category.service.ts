import { Loggable,AppValidationError,NotFoundError, ERROR_CODES } from "@neon-lab-dev/platform";
import { Category } from "../../entity/category";
import { CategoryEntityBuilder } from "./models/builder/categoryEntityBuilder";
import { CreateCategoryRequest } from "./models/request/createCategoryRequest";
import { FetchCategoriesRequest } from "./models/request/fetchCategoriesRequest";
import { CategoryRepository } from "./repository/category.repository";

class CategoryService {
    private repository: CategoryRepository = new CategoryRepository();

    public async checkIfCategoryExistsById(id: string): Promise<void> {
        const categoryidexists = await this.repository.findById(id);
        if (!categoryidexists) {
            throw new NotFoundError(
                "Category not found in Database"
            );
        }
    }

    private async checkIfCategoryExistsbyname(name: string): Promise<void> {
        const categorynameexists = await this.repository.findByName(name);
        if (categorynameexists) {
            throw new AppValidationError(
                "Category already exists in Database",
                ERROR_CODES.DUPLICATE_ENTRY
            );
        }
    }

    @Loggable()
    public async create(req: CreateCategoryRequest): Promise<Category> {
        await this.checkIfCategoryExistsbyname(req.name);
        const entity = CategoryEntityBuilder.builder().of(req).build();
        return this.repository.create(entity);
    }

    @Loggable()
    public async fetch(req: FetchCategoriesRequest): Promise<Category[]> {
        return this.repository.findAll();
    }
}

export default new CategoryService();