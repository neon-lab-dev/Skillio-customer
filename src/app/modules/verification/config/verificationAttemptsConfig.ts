import { logger } from "../../../utils/logger";
import { SystemConfig } from "../../../entity/systemConfig";
import { TVerificationConfig } from "../interface/verification.interface";

let verificationConfig: SystemConfig | undefined;

export const loadVerificationConfig = async (configs: Record<string, SystemConfig>) => {
  try {
    verificationConfig = configs["VERIFICATION"];
  } catch (error) {
    logger.error("Error loading verification configuration:", error);
  } 
};

export const getVerificationConfig = async (): Promise<TVerificationConfig | undefined> => {
  return verificationConfig?.configValue;
};