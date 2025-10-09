import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";
import { logger } from "../../../utils/logger";
import { TAddressPinCodeConfig } from "../interface/registration.interface";
    
let addressPinConfig: TAddressPinCodeConfig | undefined;

export const loadAddressPinConfig = async () => {
  try {
    const config = await systemConfigRepository.getConfigByKey("MAX_ADDRESS_PIN_CODE");

    if (!config) {
      logger.error("Address pin code configuration not found");
      throw new AppError(500, "Address pin code configuration not found");
    }

    addressPinConfig = config.configValue as TAddressPinCodeConfig;

  } catch (error) {
    logger.error("Error loading address pin code configuration:", error);
    throw new AppError(500, "Error loading address pin code configuration");
  }
  
};

export const getAddressPinCodeConfig = async (): Promise<TAddressPinCodeConfig> => {
  try{
    if(!addressPinConfig){
      logger.error("Address pin code configuration not loaded");
      throw new AppError(500, "Address pin code configuration not loaded");
    }

    return addressPinConfig;
  }catch(error){
    logger.error("Error getting address pin code configuration:", error);
    throw new AppError(500, "Error getting address pin code configuration");
  }
};
