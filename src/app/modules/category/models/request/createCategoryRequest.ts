import { AppRequest } from "@neon-lab-dev/platform";

export class CreateCategoryRequest implements AppRequest{
    name!:string;
}