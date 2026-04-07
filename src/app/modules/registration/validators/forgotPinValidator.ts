import {  Validator } from "@neon-lab-dev/platform";
import { ForgotPinRequest } from "../models/request/forgotPinRequest";
import { forgotPinSchema } from "../registration.validation";

class ForgotPinValidator implements Validator{
    async validate(req: ForgotPinRequest): Promise<void> | never {
        forgotPinSchema.parse(req);
    }
}

export default new ForgotPinValidator();