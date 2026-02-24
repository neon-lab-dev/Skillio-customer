import {  Validator } from "@neon-lab-dev/platform";
import { fetchDocumentsSchema } from "../document.validation";
import { FetchDocumentsRequest } from "../models/request/fetchDocumentsRequest";

class FetchDocumentsValidator implements Validator{
    async validate(req: FetchDocumentsRequest): Promise<void> | never {
        fetchDocumentsSchema.parse(req);
    }
}

export default new FetchDocumentsValidator();