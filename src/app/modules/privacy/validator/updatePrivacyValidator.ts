import {  Validator } from "@neon-lab-dev/platform";
import { UpdatePrivacyRequest } from "../models/request/updatePrivacyRequest";
import { updatePrivacySchema } from "../models/schema/updatePrivacySchema";

class UpdatePrivacyValidator implements Validator{
    async validate(req: UpdatePrivacyRequest): Promise<void> | never {
        updatePrivacySchema.parse(req);
    }
}

export default new UpdatePrivacyValidator();