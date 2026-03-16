import { AppRequest } from "@neon-lab-dev/platform";

export class FetchSubCategoryRequest implements AppRequest{
    categoryId!:string;
}