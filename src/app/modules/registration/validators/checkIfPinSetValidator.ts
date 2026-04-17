import {  Validator } from "@neon-lab-dev/platform";
import { CheckIfPinSetRequest } from "../models/request/checkIfPinSetRequest";
import { checkIfPinSetSchema } from "../registration.validation";

class CheckIfPinSetValidator implements Validator{
    async validate(req: CheckIfPinSetRequest): Promise<void> | never {
        checkIfPinSetSchema.parse(req);
    }
}

export default new CheckIfPinSetValidator();