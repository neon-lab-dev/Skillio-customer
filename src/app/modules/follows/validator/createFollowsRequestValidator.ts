import { Validator } from "@neon-lab-dev/platform";
import { CreateFollowsRequest } from "../model/request/createFollowsRequest";
import { createFollowsSchema } from "../model/request/schema/followsSchema";

class CreateFollowsRequestValidator implements Validator{
    async validate(req: CreateFollowsRequest): Promise<void> | never {
        createFollowsSchema.parse(req);
    }
}

export default new CreateFollowsRequestValidator();