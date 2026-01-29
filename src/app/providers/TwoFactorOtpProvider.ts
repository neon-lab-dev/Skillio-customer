import { NotificationProvider, ProviderResult } from "./interface/notification.provider.interface";
import { logger } from "../utils/logger";
import { Notification } from "../entity/notification";
import axios from "axios";
import { getTwoFactorConfig } from "../modules/notification/config/twoFactorConfig";
import { getOtpConfig } from "../modules/verification/config/otpConfig";

export class TwoFactorOtpProvider implements NotificationProvider {

  async send(notification: Notification): Promise<ProviderResult> {
    try {
        const twoFactorConfig= await getTwoFactorConfig();
        const otpConfig= await getOtpConfig();

        let url=`${twoFactorConfig.baseUrl}/${twoFactorConfig.apikey}/SMS/${notification.to}/${notification.bodyText}`;

        
        if(otpConfig.testMode){
          return{
            ok: true,
            response: "Test mode is enabled. sms sent."
          }
        }else{
          const res= await axios.get(url);
          return{
              ok: res.status===200,
              response: res.data
          }
        }

    } catch (error) {
        logger.error(`TwoFactorOtpProvider: Failed to send SMS to ${notification.to}:`, error);
        return{
            ok: false,
            response: `Failed to send SMS: ${error}`
        }
    }
  }
}