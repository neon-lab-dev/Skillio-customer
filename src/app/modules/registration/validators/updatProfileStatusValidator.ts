import { Validator } from "../../../interface/interface.validator";
import { UpdateProfileStatusRequest } from "../models/request/updateProfileStatusRequest";
import { updateProfileStatusSchema } from "../registration.validation";

class UpdateProfileStatusValidator implements Validator{
    async validate(req: UpdateProfileStatusRequest): Promise<void> | never {
        updateProfileStatusSchema.parse(req);
    }
}

export default new UpdateProfileStatusValidator()