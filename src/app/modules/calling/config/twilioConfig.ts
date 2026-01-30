import systemConfigRepository from "../../../repository/systemConfigRepository";
import { logger } from "../../../utils/logger";
import { TTwilioConfig } from "../interface/twilioConfigInterface";
import { NotFoundError } from "@neon-lab-dev/platform";

let twilioConfig: TTwilioConfig | undefined;

export const loadTwilioConfig = async () => {
    const config = await systemConfigRepository.getConfigByKey("TWILIO");

    if (!config) {
      logger.error("Twilio configuration not found");
      throw new NotFoundError("Twilio configuration not found");
    }

    twilioConfig = config.configValue as TTwilioConfig;

};

export const getTwilioonfig = async (): Promise<TTwilioConfig> => {
    if(!twilioConfig){
      logger.error("Twilio configuration not loaded");
      throw new NotFoundError("Twilio configuration not loaded");
    }

    return twilioConfig;
};
