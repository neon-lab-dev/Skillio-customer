"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = void 0;
const appError_1 = __importDefault(require("../errors/appError"));
const logger_1 = require("./logger");
const twilioConfig_1 = require("../config/twilioConfig");
const twilio_1 = __importDefault(require("twilio"));
const createMessage = async (phone, otp) => {
    try {
        const systemConfig = await (0, twilioConfig_1.getTwilioConfig)();
        if (!systemConfig) {
            logger_1.logger.error("SMS provider configuration not found");
            throw new appError_1.default(500, "SMS provider configuration not found");
        }
        const accountSid = systemConfig.apiKey;
        const authToken = systemConfig.apiSecret;
        // Validate credentials before creating client
        if (!accountSid || !authToken) {
            throw new appError_1.default(500, "Twilio credentials are missing. Please check provider configuration for SMS.");
        }
        const client = (0, twilio_1.default)(accountSid, authToken);
        const account = await client.api.accounts(accountSid).fetch();
        if (account.status !== "active") {
            throw new appError_1.default(500, `Twilio account is not active. Current status: ${account.status}`);
        }
        const message = await client.messages.create({
            body: `Please verify your phone number with the OTP: ${otp}`,
            from: systemConfig.twilioPhoneNumber, // Make sure this number is verified in your Twilio account(configure it in local)
            to: phone,
        });
        if (!message) {
            throw new Error("No message response from Twilio");
        }
        return message;
    }
    catch (error) {
        console.error("Twilio API Error:", error);
        throw new appError_1.default(500, `Failed to send SMS via Twilio`);
    }
};
exports.createMessage = createMessage;
