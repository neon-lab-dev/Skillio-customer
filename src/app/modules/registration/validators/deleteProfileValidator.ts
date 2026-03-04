import {  Validator } from "@neon-lab-dev/platform";
import { DeleteProfileRequest } from "../models/request/deleteProfileRequest";
import { deleteProfileSchema } from "../registration.validation";

class DeleteProfileValidator implements Validator{
    async validate(req: DeleteProfileRequest): Promise<void> | never {
        deleteProfileSchema.parse(req);
    }
}

export default new DeleteProfileValidator();