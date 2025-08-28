import { NotificationProvider, ProviderResult } from "./NotificationProvider";
import { Medium } from "../entity/notification";
import { logger } from "../utils/logger";
import { createMessage } from "../utils/twilio";
import { Notification } from "../entity/notification";

export class TwilioSmsProvider implements NotificationProvider {
  name = "twilio";
  medium = Medium.SMS

  async send(notification: Notification): Promise<ProviderResult> {
    try {
      
      const message = await createMessage(
        notification.phone as string, 
        notification.bodyText?.otp as string
      );
      
      logger.info(`TwilioSmsProvider: SMS sent successfully to ${notification.phone}. Message SID: ${message.sid}`);

      return { 
        ok: true, 
        response: { 
          sid: message.sid,
          status: message.status,
          to: message.to 
        } 
      };
    } catch (error) {
      logger.error(`TwilioSmsProvider: Failed to send SMS to ${notification.phone}:`, error);
      return { 
        ok: false, 
        response: `Failed to send SMS: ${error}` 
      };
    }
  }
}