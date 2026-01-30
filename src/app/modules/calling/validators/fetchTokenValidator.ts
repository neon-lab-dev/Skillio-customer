import { Validator } from "@neon-lab-dev/platform";
import { FetchTokenRequest } from "../models/request/fetchTokenRequest";
import { fetchTokenSchema } from "../call.validation";

class FetchTokenValidator implements Validator{
    async validate(req: FetchTokenRequest): Promise<void> | never {
        fetchTokenSchema.parse(req)
    }
}

export default new FetchTokenValidator()