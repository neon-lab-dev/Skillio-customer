import { Validator } from "../../../interface/interface.validator";
import { fetchProfilesSchema } from "../registration.validation";
import { ProfileSearchCriteria } from "../models/searchCriteria.ts/profileSearchCriteria";

class FetchProfileValidator implements Validator{
    async validate(req: ProfileSearchCriteria): Promise<void> | never {
        fetchProfilesSchema.parse(req);
    }
}

export default new FetchProfileValidator();