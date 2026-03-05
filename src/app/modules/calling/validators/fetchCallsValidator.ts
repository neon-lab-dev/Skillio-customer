import {  Validator } from "@neon-lab-dev/platform";
import { FetchCallsRequest } from "../models/request/fetchCallsRequest";
import { fetchCallsSchema } from "../call.validation";

class FetchCallsValidator implements Validator{
    async validate(req: FetchCallsRequest): Promise<void> | never {
        fetchCallsSchema.parse(req);
    }
}

export default new FetchCallsValidator();