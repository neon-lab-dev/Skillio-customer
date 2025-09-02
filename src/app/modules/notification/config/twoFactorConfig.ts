import { SystemConfig } from "../../../entity/systemConfig";
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
  }
};

export const getTwoFactorConfig = async (): Promise<TTwoFactorConfig | undefined> => {
  return twoFactorConfig?.configValue;
};
