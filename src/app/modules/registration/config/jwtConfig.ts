import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";
import { logger } from "../../../utils/logger";
import { TJwtConfig } from "../interface/registration.interface";

let jwtConfig: TJwtConfig | undefined;

export const loadJwtConfig = async () => {
  try {
    const config = await systemConfigRepository.getConfigByKey("JWT");

    if (!config) {
      logger.error("Jwt configuration not found");
      throw new AppError(500, "Jwt configuration not found");
    }

    jwtConfig = config.configValue as TJwtConfig;


  } catch (error) {
    logger.error("Error loading jwt configuration:", error);
    throw new AppError(500, "Error loading jwt configuration");
  }
};

export const getJwtConfig = async (): Promise<TJwtConfig> => {
  try{
    if(!jwtConfig){
      logger.error("jwt configuration not loaded");
      throw new AppError(500, "jwt configuration not loaded");
    }

    return jwtConfig;
  }catch(error){
    logger.error("Error getting jwt configuration:", error);
    throw new AppError(500, "Error getting jwt configuration");
  }
};
