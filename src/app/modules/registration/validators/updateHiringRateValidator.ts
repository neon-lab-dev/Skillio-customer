import {  Validator } from "@neon-lab-dev/platform";
import { UpdateHiringRateRequest } from "../models/request/updateHiringRateRequest";
import { updateHiringRateSchema } from "../registration.validation";

class UpdateHiringRateValidator implements Validator{
    async validate(req: UpdateHiringRateRequest): Promise<void> | never {
        updateHiringRateSchema.parse(req);
    }
}

export default new UpdateHiringRateValidator();