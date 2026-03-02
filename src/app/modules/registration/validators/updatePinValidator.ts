import {  Validator } from "@neon-lab-dev/platform";
import { UpdatePinRequest } from "../models/request/updatePinRequest";
import { updatePinSchema } from "../registration.validation";

class updatePinValidator implements Validator{
    async validate(req: UpdatePinRequest): Promise<void> | never {
        updatePinSchema.parse(req);
    }
}

export default new updatePinValidator()