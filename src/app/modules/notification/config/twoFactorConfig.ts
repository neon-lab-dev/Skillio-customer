import { SystemConfig } from "../../../entity/systemConfig";
import AppError from "../../../errors/appError";
import { logger } from "../../../utils/logger";
import { TTwoFactorConfig } from "../interface/twoFactorInterface";

let twoFactorConfig: SystemConfig | undefined;

export const loadTwoFactorConfig = async (
  configs: Record<string, SystemConfig>
) => {
  try {
    twoFactorConfig = configs["TWO_FACTOR"];
  } catch (error) {
    logger.error("Error loading two factor configuration:", error);
    throw new AppError(500, "Error loading two factor configuration");
  }
};

export const getTwoFactorConfig = async (): Promise<TTwoFactorConfig> => {
  try{
    return twoFactorConfig?.configValue;
  }catch(error){
    logger.error("Error getting two factor configuration:", error);
    throw new AppError(500, "Error getting two factor configuration");
  }
};
