import { Loggable } from "@neon-lab-dev/platform";
import { SubCategoryRepository } from "./repository/subCategory.repository";
import { CreateSubCategoryRequest } from "./models/request/createSubCategoryRequest";
import { SubCategory } from "../../entity/subCategory";
import { SubCategoryEntityBuilder } from "./models/builder/subCategoryEntityBuilder";
import { FetchSubCategoryRequest } from "./models/request/fetchSubCategoryRequest";

class SubCategoryService {
    private repository: SubCategoryRepository= new SubCategoryRepository();


    @Loggable()
    public async create(req: CreateSubCategoryRequest):Promise<SubCategory>{
        const entity= SubCategoryEntityBuilder.builder().of(req).build();

        return this.repository.create(entity);
    }

    @Loggable()
    public async fetch(req: FetchSubCategoryRequest):Promise<SubCategory[]>{
        return this.repository.findAll();
    }
}

export default new SubCategoryService()