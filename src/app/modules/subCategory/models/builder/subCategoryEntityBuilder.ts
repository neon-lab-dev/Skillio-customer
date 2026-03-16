import { SubCategory } from "../../../../entity/subCategory";
import { CreateSubCategoryRequest } from "../request/createSubCategoryRequest";

export class SubCategoryEntityBuilder{
    private entity: SubCategory;

    private constructor(){
        this.entity= new SubCategory()
    }

    public static builder(): SubCategoryEntityBuilder{
        return new SubCategoryEntityBuilder();
    }

    public of(req: CreateSubCategoryRequest): SubCategoryEntityBuilder{
        this.entity.name= req.name;
        this.entity.categoryId= req.categoryId;
        return this;
    }

    public build(): SubCategory{
        return this.entity;
    }
}