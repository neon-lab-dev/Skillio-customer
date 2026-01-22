import AppError from "../errors/appError";
import { Notification } from "../entity/notification";
import { logger } from "../utils/logger";
import { NotificationProvider } from "./interface/notification.provider.interface";
import { TwoFactorOtpProvider } from "./TwoFactorOtpProvider";
import { Medium } from "../modules/notification/enums/notificationEnum";
import { AppNotificationProvider } from "./appNotification/appNotification.provider";

class ProviderFactory {
    private static twoFactorOtpProvider: TwoFactorOtpProvider

    private static appNotificationProvider: AppNotificationProvider

    // initialize all the providers at runtime
    initializeProviders=()=>{
        ProviderFactory.twoFactorOtpProvider= new TwoFactorOtpProvider();
        ProviderFactory.appNotificationProvider= new AppNotificationProvider();
    }

    resolve=(notificaion: Partial<Notification>): NotificationProvider | null =>{
        switch(notificaion.medium){
            case Medium.SMS:
                return ProviderFactory.twoFactorOtpProvider;
            
            case Medium.NOTIFICATION:
                return ProviderFactory.appNotificationProvider;

            default: 
                logger.error(`ProviderFactory: No provider found for medium ${notificaion.medium}`);
                throw new AppError(400, "No provider found for the specified medium");
        }
    }
}

export default new ProviderFactory();