import {  Validator } from "@neon-lab-dev/platform";
import { fetchNotificaionSchema } from "../models/request/schema/schema.fetch.notificaion";
import { NotificatinSearchCriteria } from "../models/request/searchCriteria/notificationSearchCriteria";

class FetchNotificationValidator implements Validator{
    async validate(req: NotificatinSearchCriteria): Promise<void> | never {
        fetchNotificaionSchema.parse(req);
    }
}

export default new FetchNotificationValidator()