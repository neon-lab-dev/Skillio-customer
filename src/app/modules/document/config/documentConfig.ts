import AppError from "../../../errors/appError";
import systemConfigRepository from "../../../repository/systemConfigRepository";
import { logger } from "../../../utils/logger";
import { TDocumentConfig } from "../interface/document.interface";

let documentConfig: TDocumentConfig | undefined;

export const loadDocumentConfig = async () => {
  try {
    const config = await systemConfigRepository.getConfigByKey("DOCUMENT");

    if (!config) {
      logger.error("Document configuration not found");
      throw new AppError(500, "Document configuration not found");
    }

    documentConfig = config.configValue as TDocumentConfig;

  } catch (error) {
    logger.error("Error loading document configuration:", error);
    throw new AppError(500, "Error loading document configuration");
  }
};

export const getDocumentConfig = async (): Promise<TDocumentConfig> => {
  try{
    if(!documentConfig){
      logger.error("document configuration not loaded");
      throw new AppError(500, "document configuration not loaded");
    }

    return documentConfig;
  }catch(error){
    logger.error("Error getting document configuration:", error);
    throw new AppError(500, "Error getting document configuration");
  }
};
