import { Loggable } from "@neon-lab-dev/platform";
import { Category } from "../../entity/category";
import { CategoryEntityBuilder } from "./models/builder/categoryEntityBuilder";
import { CreateCategoryRequest } from "./models/request/createCategoryRequest";
import { FetchCategoriesRequest } from "./models/request/fetchCategoriesRequest";
import { CategoryRepository } from "./repository/category.repository";

class CategoryService{
    private repository: CategoryRepository= new CategoryRepository();

    @Loggable()
    public async create(req: CreateCategoryRequest):Promise<Category>{
        const entity= CategoryEntityBuilder.builder().of(req).build();

        return this.repository.create(entity);
    }

    @Loggable()
    public async fetch(req: FetchCategoriesRequest):Promise<Category[]>{
        return this.repository.findAll();
    }
}

export default new CategoryService();