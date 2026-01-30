import { Api, AppResponse, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { SyncSubscriptionStatusRequest } from "../models/request/request.sync";
import { syncSubscriptionStatusSchema } from "../models/schema/schema.user.subscription";
import { userSubscriptionService } from "../service/service.user.subscription";

export class SyncSubscriptionStatusApi implements Api<SyncSubscriptionStatusRequest, AppResponse> {
    
    async preprocess(req: SyncSubscriptionStatusRequest): Promise<void> | never {
        syncSubscriptionStatusSchema.parse(req);
    }
    
    async process(req: SyncSubscriptionStatusRequest): Promise<AppResponse> {
        let response = await userSubscriptionService.syncStatus(req);
        return {
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: response
        };
    }
}