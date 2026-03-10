import {  Validator } from "@neon-lab-dev/platform";
import { CreateFollowRequest } from "../models/request/createFollowRequest";
import { CreateFollowSchema } from "../models/schema/createFollowSchema";

class CreateFollowValidator implements Validator{
    async validate(req: CreateFollowRequest): Promise<void> | never {
        CreateFollowSchema.parse(req);
    }
}

export default new CreateFollowValidator();