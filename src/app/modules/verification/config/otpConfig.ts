import { logger } from "../../../utils/logger";
import { SystemConfig } from "../../../entity/systemConfig";
import { TOtpConfig } from "../interface/otpInterface";
import AppError from "../../../errors/appError";

let otpConfig: SystemConfig | undefined;

export const loadOtpConfig = async (configs: Record<string, SystemConfig>) => {
  try {
    otpConfig = configs["OTP_CONFIG"];
  } catch (error) {
    logger.error("Error loading otp configuration:", error);
    throw new AppError(500, "Error loading otp configuration");
  }
};

export const getOtpConfig = async (): Promise<TOtpConfig > => {
  try{
    return otpConfig?.configValue;
  }catch(error){
    logger.error("Error getting otp configuration:", error);
    throw new AppError(500, "Error getting otp configuration");
  }
};
