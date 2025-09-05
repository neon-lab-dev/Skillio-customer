import { logger } from "../../../utils/logger";
import { TOtpConfig } from "../interface/otpInterface";
import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";

let otpConfig: TOtpConfig | undefined;

export const loadOtpConfig = async () => {
  try {

    const config = await systemConfigRepository.getConfigByKey("OTP_CONFIG");

    if (!config) {
      logger.error("OTP configuration not found");
      throw new AppError(500, "OTP configuration not found");
    }
    otpConfig = config.configValue as TOtpConfig;
    
  } catch (error) {
    logger.error("Error loading otp configuration:", error);
    throw new AppError(500, "Error loading otp configuration");
  }
};

export const getOtpConfig = async (): Promise<TOtpConfig> => {
  try{
    if(!otpConfig){
      logger.error("OTP configuration not loaded");
      throw new AppError(500, "OTP configuration not loaded");
    }

    return otpConfig;
  }catch(error){
    logger.error("Error getting otp configuration:", error);
    throw new AppError(500, "Error getting otp configuration");
  }
};
