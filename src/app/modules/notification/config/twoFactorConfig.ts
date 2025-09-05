import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";
import { logger } from "../../../utils/logger";
import { TTwoFactorConfig } from "../interface/twoFactorInterface";

let twoFactorConfig: TTwoFactorConfig | undefined;

export const loadTwoFactorConfig = async () => {
  try {
    const config = await systemConfigRepository.getConfigByKey("TWO_FACTOR");

    if (!config) {
      logger.error("Two factor configuration not found");
      throw new AppError(500, "Two factor configuration not found");
    }

    twoFactorConfig = config.configValue as TTwoFactorConfig;

  } catch (error) {
    logger.error("Error loading two factor configuration:", error);
    throw new AppError(500, "Error loading two factor configuration");
  }
};

export const getTwoFactorConfig = async (): Promise<TTwoFactorConfig> => {
  try{
    if(!twoFactorConfig){
      logger.error("Two factor configuration not loaded");
      throw new AppError(500, "Two factor configuration not loaded");
    }

    return twoFactorConfig;
  }catch(error){
    logger.error("Error getting two factor configuration:", error);
    throw new AppError(500, "Error getting two factor configuration");
  }
};
