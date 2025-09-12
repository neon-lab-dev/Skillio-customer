import { logger } from "../../../utils/logger";
import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";
import { TCloudinaryConfig } from "../interface/cloudinaryInterface";
import { v2 as cloudinary } from "cloudinary";


let cloudinaryConfig: TCloudinaryConfig | undefined;

export const loadCloudinaryConfig = async () => {
  try {

    const config = await systemConfigRepository.getConfigByKey("CLOUDINARY");

    if (!config) {
      logger.error("Cloudinary configuration not found");
      throw new AppError(500, "Cloudinary configuration not found");
    }
    cloudinaryConfig = config.configValue as TCloudinaryConfig;

    cloudinary.config({
        cloud_name: cloudinaryConfig.cloudName,
        api_key: cloudinaryConfig.apiKey,
        api_secret: cloudinaryConfig.apiSecret,
    })

  } catch (error) {
    logger.error("Error loading Cloudinary configuration:", error);
    throw new AppError(500, "Error loading Cloudinary configuration");
  }
};

