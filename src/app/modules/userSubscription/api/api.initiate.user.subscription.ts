import { Api, AppResponse, AppValidationError, AsyncContextService, ERROR_CODES, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { InitiateUserSubscriptionRequest } from "../models/request/request.create";
import { createUserSubscriptionSchema } from "../models/schema/schema.user.subscription";
import { profileService } from "../../profile/service.profile";
import { userSubscriptionService } from "../service/service.user.subscription";

export class InitiateUserSubscriptionApi implements Api<InitiateUserSubscriptionRequest, AppResponse> {
    
    async preprocess(req: InitiateUserSubscriptionRequest): Promise<void> | never {
        await userSubscriptionService.validateInitiate(req);
    }
    
    async process(req: InitiateUserSubscriptionRequest): Promise<AppResponse> {
        let userId = AsyncContextService.getUserId();
        if (userId){
            let loggedInUserProfile = await profileService.fetchWithPortfolio(userId);
            let response = await userSubscriptionService.initiate(req, loggedInUserProfile);
            return {
                status: HTTP_STATUS.CREATED,
                message: RESPONSE_MESSAGES.CREATED,
                data: response
            }
        }
        throw new AppValidationError(`User Id not found in context.`, ERROR_CODES.REQUIRED_FIELD);
    }
}