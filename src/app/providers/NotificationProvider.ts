import { Notification } from "../entity/notification";
import { Medium } from "../enums/notificationEnum";

export interface ProviderResult{
    ok: boolean;
    response?: any;
}

export interface NotificationProvider{
    name: string;
    medium:Medium;
    send(notification: Partial<Notification>): Promise<ProviderResult>;
}