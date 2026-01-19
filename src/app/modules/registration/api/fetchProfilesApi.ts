import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { AppResponse } from "@neon-lab-dev/platform";
import { ProfileSearchCriteria } from "../models/searchCriteria.ts/profileSearchCriteria";
import registrationServices from "../registration.services";
import fetchProfileValidator from "../validators/fetchProfileValidator";

export class FetchProfilesApi implements Api<ProfileSearchCriteria , AppResponse>{
    async preprocess(req: ProfileSearchCriteria):  Promise<void> | never {
        await fetchProfileValidator.validate(req)
    }

    async process(req: ProfileSearchCriteria): Promise<AppResponse> {
        const res= await registrationServices.getProfiles(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}
