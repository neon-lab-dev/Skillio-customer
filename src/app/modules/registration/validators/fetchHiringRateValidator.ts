import {  Validator } from "@neon-lab-dev/platform";
import { FetchHiringRateRequest } from "../models/request/fetchHiringRateRequest";
import { fetchHiringRateSchema } from "../registration.validation";

class FetchHiringRateValidator implements Validator{
    async validate(req: FetchHiringRateRequest): Promise<void> | never {
        fetchHiringRateSchema.parse(req)
    }
}

export default new FetchHiringRateValidator()