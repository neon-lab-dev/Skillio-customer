import { NotificationProvider, ProviderResult } from "./NotificationProvider";
import { logger } from "../utils/logger";
import { Medium } from "../enums/notificationEnum";
import { Notification } from "../entity/notification";
import axios from "axios";
import { getTwoFactorConfig } from "../modules/notification/config/twoFactorConfig";

export class TwoFactorOtpProvider implements NotificationProvider {
  name = "twoFactor";
  medium = Medium.SMS

  async send(notification: Notification): Promise<ProviderResult> {
    try {
        const twoFactorConfig= await getTwoFactorConfig();

        const url=`${twoFactorConfig.baseUrl}/${twoFactorConfig.apikey}/SMS/${notification.to}/${notification.bodyText}`;

        const res= await axios.get(url);

        return{
            ok: res.status===200,
            response: res.data
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