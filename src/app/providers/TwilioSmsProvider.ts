import { NotificationProvider, ProviderResult } from "./NotificationProvider";
import { logger } from "../utils/logger";
import { Medium } from "../enums/notificationEnum";
import { createMessage } from "../modules/notification/utils/twilio";
import { Notification } from "../entity/notification";

export class TwilioSmsProvider implements NotificationProvider {
  name = "twilio";
  medium = Medium.SMS

  async send(notification: Notification): Promise<ProviderResult> {
    try {
      
      const message = await createMessage(
        notification.to as string, 
        notification.bodyText as string
      );
      
      logger.info(`TwilioSmsProvider: SMS sent successfully to ${notification.to}. Message SID: ${message.sid}`);

      return { 
        ok: true, 
        response: { 
          sid: message.sid,
          status: message.status,
          to: message.to 
        } 
      };
    } catch (error) {
      logger.error(`TwilioSmsProvider: Failed to send SMS to ${notification.to}:`, error);
      return { 
        ok: false, 
        response: `Failed to send SMS: ${error}` 
      };
    }
  }
}