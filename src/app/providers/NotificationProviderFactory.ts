import AppError from "../errors/appError";
import { Notification } from "../entity/notification";
import { logger } from "../utils/logger";
import { NotificationProvider } from "./NotificationProvider";
import { TwoFactorOtpProvider } from "./TwoFactorOtpProvider";

class ProviderFactory {
    private static twoFactorOtpProvider: TwoFactorOtpProvider

    // initialize all the providers at runtime
    initializeProviders=()=>{
        ProviderFactory.twoFactorOtpProvider= new TwoFactorOtpProvider();
    }

    resolve=(notificaion: Partial<Notification>): NotificationProvider | null =>{
        switch(notificaion.medium){
            case "SMS":
                return ProviderFactory.twoFactorOtpProvider;

            default: 
                logger.error(`ProviderFactory: No provider found for medium ${notificaion.medium}`);
                throw new AppError(400, "No provider found for the specified medium");
        }
    }
}

export default new ProviderFactory();