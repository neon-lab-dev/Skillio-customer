import {  Validator } from "@neon-lab-dev/platform";
import { FetchProfileDetailsRequest } from "../models/request/fetchProfileDetailsRequest";
import { fetchProfileDetailsSchema } from "../registration.validation";

class FetchProfileDetailsValidator implements Validator{
    async validate(req: FetchProfileDetailsRequest): Promise<void> | never {
        fetchProfileDetailsSchema.parse(req);
    }
}

export default new FetchProfileDetailsValidator()