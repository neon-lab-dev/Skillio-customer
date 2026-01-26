import { Api, AppResponse, AppValidationError, AsyncContextService, ERROR_CODES, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UserSubscriptionRequest } from "../models/request/request.create";
import { profileService } from "../../profile/service.profile";
import { userSubscriptionService } from "../service/service.user.subscription";


export class FetchNonTerminalSubscriptionApi implements Api<UserSubscriptionRequest, AppResponse>{
    
    async preprocess(req: UserSubscriptionRequest): Promise<void> | never {
        //ignored
    }
    
    async process(req: UserSubscriptionRequest): Promise<AppResponse> {
        let userId = AsyncContextService.getUserId();
        if (userId){
            let loggedInUserProfile = await profileService.fetchWithPortfolio(userId);
            let response = await userSubscriptionService.fetch(req, loggedInUserProfile);
            if (response){
                return {
                    status: HTTP_STATUS.SUCCESS,
                    message:RESPONSE_MESSAGES.SUCCESS,
                    data: response
                }
            }
            return {
                status: HTTP_STATUS.SUCCESS,
                message: RESPONSE_MESSAGES.NOT_FOUND
            }
        }
        throw new AppValidationError(`User Id not found in the context.`, ERROR_CODES.REQUIRED_FIELD);
    }
}