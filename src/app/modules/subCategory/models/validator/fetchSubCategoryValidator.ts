import {  Validator } from "@neon-lab-dev/platform";
import { FetchSubCategoryRequest } from "../request/fetchSubCategoryRequest";
import { fetchSubCategorySchema } from "../schema/subCategorySchema";

class FetchSubCategoryValidtor implements Validator{
    async validate(req: FetchSubCategoryRequest): Promise<void> | never {
        fetchSubCategorySchema.parse(req);
    }
}

export default new FetchSubCategoryValidtor();