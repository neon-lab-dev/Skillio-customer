import AppError from "../errors/appError";
import { Notification } from "../entity/notification";
import { logger } from "../utils/logger";
import { NotificationProvider } from "./NotificationProvider";
import { TwilioSmsProvider } from "./TwilioSmsProvider";

export class ProviderFactory {
    private registry: NotificationProvider[] = [];

    constructor(){
        this.registry = [
            new TwilioSmsProvider()
        ];
    }

    resolve=(notificaion: Partial<Notification>): NotificationProvider | null =>{
        const provider = this.registry.find(p => p.medium === notificaion.medium);
        if(!provider){
            logger.error(`No provider found for medium: ${notificaion.medium}`);
            throw new AppError(500, `No provider found for medium: ${notificaion.medium}`);
        }
        return provider || null;
    }
}