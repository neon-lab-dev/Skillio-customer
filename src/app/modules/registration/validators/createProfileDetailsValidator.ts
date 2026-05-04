import {  Validator } from "@neon-lab-dev/platform";
import { CreateProfileDetailsRequest } from "../models/request/createProfileDetailsRequest";
import { ProfileDetailsSchema } from "../registration.validation";

class CreateProfileDetailsValidator implements Validator{
    async validate(req: CreateProfileDetailsRequest): Promise<void> | never {
        ProfileDetailsSchema.parseAsync(req);
    }
}

export default new CreateProfileDetailsValidator();