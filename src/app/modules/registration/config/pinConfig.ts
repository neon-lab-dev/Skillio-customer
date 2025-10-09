import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";
import { logger } from "../../../utils/logger";
import { TPinConfig } from "../interface/registration.interface";
    
let pinConfig: TPinConfig | undefined;

export const loadPinConfig = async () => {
  try {
    const config = await systemConfigRepository.getConfigByKey("PIN");

    if (!config) {
      logger.error("Pin configuration not found");
      throw new AppError(500, "Pin configuration not found");
    }

    pinConfig = config.configValue as TPinConfig;

  } catch (error) {
    logger.error("Error loading pin configuration:", error);
    throw new AppError(500, "Error loading pin configuration");
  }
};

export const getPinConfig = async (): Promise<TPinConfig> => {
  try{
    if(!pinConfig){
      logger.error("Pin configuration not loaded");
      throw new AppError(500, "Pin configuration not loaded");
    }

    return pinConfig;
  }catch(error){
    logger.error("Error getting pin configuration:", error);
    throw new AppError(500, "Error getting pin configuration");
  }
};
