import { Category } from "../../../../entity/category";
import { CreateCategoryRequest } from "../request/createCategoryRequest";

export class CategoryEntityBuilder{
    private entity: Category;

    private constructor(){
        this.entity= new Category();
    }

    public static builder():CategoryEntityBuilder{
        return new CategoryEntityBuilder()
    }

    public of(req: CreateCategoryRequest): CategoryEntityBuilder{
        this.entity.name= req.name;
        return this;
    }

    public build(): Category{
        return this.entity;
    }
}