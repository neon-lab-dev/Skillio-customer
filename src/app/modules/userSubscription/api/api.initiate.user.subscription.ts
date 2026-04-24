import { Api, AppResponse, AppValidationError, AsyncContextService, ERROR_CODES, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { UserSubscriptionRequest } from "../models/request/request.create";
import { userSubscriptionService } from "../service/service.user.subscription";
import registrationServices from "../../registration/registration.services";

export class InitiateUserSubscriptionApi implements Api<UserSubscriptionRequest, AppResponse> {
    
    async preprocess(req: UserSubscriptionRequest): Promise<void> | never {
        await userSubscriptionService.validateInitiate(req);
    }
    
    async process(req: UserSubscriptionRequest): Promise<AppResponse> {
        let userId = AsyncContextService.getUserId();
        if (userId){
            let loggedInUserProfile = await registrationServices.checkExisting(userId);
            let response = await userSubscriptionService.initiate(req, loggedInUserProfile!);
            return {
                status: HTTP_STATUS.CREATED,
                message: RESPONSE_MESSAGES.CREATED,
                data: response
            }
        }
        throw new AppValidationError(`User Id not found in context.`, ERROR_CODES.REQUIRED_FIELD);
    }
}