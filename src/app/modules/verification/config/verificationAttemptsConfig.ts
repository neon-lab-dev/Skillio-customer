import { logger } from "../../../utils/logger";
import { SystemConfig } from "../../../entity/systemConfig";
import { TVerificationConfig } from "../interface/verification.interface";
import AppError from "../../../errors/appError";

let verificationConfig: SystemConfig | undefined;

export const loadVerificationConfig = async (configs: Record<string, SystemConfig>) => {
  try {
    verificationConfig = configs["VERIFICATION"];
  } catch (error) {
    logger.error("Error loading verification configuration:", error);
    throw new AppError(500, "Error loading verification configuration");
  } 
};

export const getVerificationConfig = async (): Promise<TVerificationConfig> => {
  try{
    return verificationConfig?.configValue;
  }catch(error){
    logger.error("Error getting verification configuration:", error);
    throw new AppError(500, "Error getting verification configuration");
  }
};