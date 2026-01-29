import { Notification } from "../../entity/notification";

export interface ProviderResult{
    ok: boolean;
    response?: any;
}

export interface NotificationProvider{
    send(notification: Partial<Notification>): Promise<ProviderResult>;
}