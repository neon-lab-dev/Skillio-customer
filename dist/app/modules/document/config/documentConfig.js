"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentConfig = exports.loadDocumentConfig = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
const logger_1 = require("../../../utils/logger");
let documentConfig;
const loadDocumentConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("DOCUMENT");
        if (!config) {
            logger_1.logger.error("Document configuration not found");
            throw new appError_1.default(500, "Document configuration not found");
        }
        documentConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading document configuration:", error);
        throw new appError_1.default(500, "Error loading document configuration");
    }
};
exports.loadDocumentConfig = loadDocumentConfig;
const getDocumentConfig = async () => {
    try {
        if (!documentConfig) {
            logger_1.logger.error("document configuration not loaded");
            throw new appError_1.default(500, "document configuration not loaded");
        }
        return documentConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting document configuration:", error);
        throw new appError_1.default(500, "Error getting document configuration");
    }
};
exports.getDocumentConfig = getDocumentConfig;
