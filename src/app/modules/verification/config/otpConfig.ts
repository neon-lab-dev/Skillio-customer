import { logger } from "../../../utils/logger";
import { SystemConfig } from "../../../entity/systemConfig";
import { TOtpConfig } from "../interface/otpInterface";

let otpConfig: SystemConfig | undefined;

export const loadOtpConfig = async (configs: Record<string, SystemConfig>) => {
  try {
    otpConfig = configs["OTP_CONFIG"];
  } catch (error) {
    logger.error("Error loading otp configuration:", error);
  }
};

export const getOtpConfig = async (): Promise<TOtpConfig | undefined> => {
  return otpConfig?.configValue;
};
