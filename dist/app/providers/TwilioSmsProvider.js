"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioSmsProvider = void 0;
const logger_1 = require("../utils/logger");
const notificationEnum_1 = require("../enums/notificationEnum");
const twilio_1 = require("../modules/notification/utils/twilio");
class TwilioSmsProvider {
    constructor() {
        this.name = "twilio";
        this.medium = notificationEnum_1.Medium.SMS;
    }
    async send(notification) {
        try {
            const message = await (0, twilio_1.createMessage)(notification.to, notification.bodyText);
            logger_1.logger.info(`TwilioSmsProvider: SMS sent successfully to ${notification.to}. Message SID: ${message.sid}`);
            return {
                ok: true,
                response: {
                    sid: message.sid,
                    status: message.status,
                    to: message.to
                }
            };
        }
        catch (error) {
            logger_1.logger.error(`TwilioSmsProvider: Failed to send SMS to ${notification.to}:`, error);
            return {
                ok: false,
                response: `Failed to send SMS: ${error}`
            };
        }
    }
}
exports.TwilioSmsProvider = TwilioSmsProvider;
