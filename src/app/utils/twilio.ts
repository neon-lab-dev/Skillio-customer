import AppError from "../errors/appError";
import { logger } from "./logger";
import { getTwilioConfig } from "../config/twilioConfig";
import twilio from "twilio";

export const createMessage = async (phone: string, otp: string) => {
    try {
        const systemConfig = await getTwilioConfig();
        if(!systemConfig){
            logger.error("SMS provider configuration not found");
            throw new AppError(500, "SMS provider configuration not found");
        }
        
        const accountSid = systemConfig.apiKey as string
        const authToken = systemConfig.apiSecret as string


        // Validate credentials before creating client
        if (!accountSid || !authToken) {
            throw new AppError(500, "Twilio credentials are missing. Please check provider configuration for SMS.");
        }

        const client = twilio(accountSid, authToken);

        const account = await client.api.accounts(accountSid).fetch();
        if (account.status !== "active") {
            throw new AppError(500, `Twilio account is not active. Current status: ${account.status}`);
        }

        
        const message = await client.messages.create({
            body: `Please verify your phone number with the OTP: ${otp}`,
            from: systemConfig.twilioPhoneNumber as string, // Make sure this number is verified in your Twilio account(configure it in local)
            to: phone,
        });

        if(!message){
            throw new Error("No message response from Twilio");
        }

        return message;
    } catch (error) {
        console.error("Twilio API Error:", error);
        throw new AppError(500, `Failed to send SMS via Twilio`);
    }
};