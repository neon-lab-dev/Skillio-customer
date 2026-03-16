import { AppRequest } from "@neon-lab-dev/platform";

export class CreateSubCategoryRequest implements AppRequest{
    name!:string;
    categoryId!:string;
}