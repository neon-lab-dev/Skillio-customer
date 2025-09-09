import { logger } from "../../../utils/logger";
import { TVerificationConfig } from "../interface/verification.interface";
import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";

let verificationConfig: TVerificationConfig | undefined;

export const loadVerificationConfig = async () => {
  try {
    const config = await systemConfigRepository.getConfigByKey("VERIFICATION");
    if (!config) {
      logger.error("Verification configuration not found");
      throw new AppError(500, "Verification configuration not found");
    }

    verificationConfig = config.configValue as TVerificationConfig;

  } catch (error) {
    logger.error("Error loading verification configuration:", error);
    throw new AppError(500, "Error loading verification configuration");
  } 
};

export const getVerificationConfig = async (): Promise<TVerificationConfig> => {
  try{
    if(!verificationConfig){
      logger.error("Verification configuration not loaded");
      throw new AppError(500, "Verification configuration not loaded");
    }

    return verificationConfig;
  }catch(error){
    logger.error("Error getting verification configuration:", error);
    throw new AppError(500, "Error getting verification configuration");
  }
};