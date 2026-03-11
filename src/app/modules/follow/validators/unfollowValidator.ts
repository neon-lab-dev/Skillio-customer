import {  Validator } from "@neon-lab-dev/platform";
import { UnfollowRequest } from "../models/request/unfollowRequest";
import { unfollowSchema } from "../models/schema/followSchema";

class UnfollowValidator implements Validator{
    async validate(req: UnfollowRequest): Promise<void> | never {
        unfollowSchema.parse(req);
    }
}

export default new UnfollowValidator()