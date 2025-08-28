import { Medium  ,Notification } from "../entity/notification";

export interface ProviderResult{
    ok: boolean;
    response?: any;
}

export interface NotificationProvider{
    name: string;
    medium:Medium;
    send(notification: Notification): Promise<ProviderResult>;
}