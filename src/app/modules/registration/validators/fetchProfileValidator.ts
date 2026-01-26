import { fetchProfilesSchema } from "../registration.validation";
import { ProfileSearchCriteria } from "../models/searchCriteria.ts/profileSearchCriteria";
import { Validator } from "@neon-lab-dev/platform";

class FetchProfileValidator implements Validator{
    async validate(req: ProfileSearchCriteria): Promise<void> | never {
        fetchProfilesSchema.parse(req);
    }
}

export default new FetchProfileValidator();