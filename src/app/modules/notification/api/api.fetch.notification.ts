import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { AppResponse } from "@neon-lab-dev/platform";
import notificationServices from "../services/notification.services";
import fetchNotificationValidator from "../validator/fetchNotificationValidator";
import { NotificatinSearchCriteria } from "../models/request/searchCriteria/notificationSearchCriteria";

export class FetchNotificationApi implements Api< NotificatinSearchCriteria , AppResponse>{
    async preprocess(req: NotificatinSearchCriteria): Promise<void> | never {
        await fetchNotificationValidator.validate(req);
    }

    async process(req: NotificatinSearchCriteria): Promise<AppResponse> {
        const res= await notificationServices.fetch(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}

