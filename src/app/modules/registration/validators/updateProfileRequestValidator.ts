import {  Validator } from "@neon-lab-dev/platform";
import { UpdateProfileRequest } from "../models/request/updateProfileRequest";
import { updateProfileSchema } from "../registration.validation";

class UpdateProfileRequestVaildator implements Validator{
    async validate(req:UpdateProfileRequest ): Promise<void> | never {
        updateProfileSchema.parse(req);
    }
}

export default new UpdateProfileRequestVaildator();