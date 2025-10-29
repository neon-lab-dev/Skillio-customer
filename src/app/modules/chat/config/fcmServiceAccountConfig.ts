import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";
import { logger } from "../../../utils/logger";
import { TFcmServiceAccountConfig } from "../interface/chat.interface";    

let fcmSerivceAccountConfig: TFcmServiceAccountConfig | undefined;

export const loadFcmServiceAccountConfig = async () => {
  try {
    const config = await systemConfigRepository.getConfigByKey("fcmServiceAccountKey");

    if (!config) {
      logger.error("fcm service account configuration not found");
      throw new AppError(500, "Fcm service account configuration not found");
    }

    fcmSerivceAccountConfig = config.configValue as TFcmServiceAccountConfig;

  } catch (error) {
    logger.error("Error loading fcm service account configuration:", error);
    throw new AppError(500, "Error loading fcm service account configuration");
  }
  
};

export const getFcmServiceAccountConfig = () => {
  try{
    if(!fcmSerivceAccountConfig){
      logger.error("fcm service account configuration not loaded");
      throw new AppError(500, "fcm service account configuration not loaded");
    }

    return fcmSerivceAccountConfig;
  }catch(error){
    logger.error("Error getting fcm service account configuration:", error);
    throw new AppError(500, "Error getting fcm service account configuration");
  }
};
