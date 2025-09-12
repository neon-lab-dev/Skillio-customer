"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCloudinaryConfig = void 0;
const logger_1 = require("../../../utils/logger");
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
const cloudinary_1 = require("cloudinary");
let cloudinaryConfig;
const loadCloudinaryConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("CLOUDINARY");
        if (!config) {
            logger_1.logger.error("Cloudinary configuration not found");
            throw new appError_1.default(500, "Cloudinary configuration not found");
        }
        cloudinaryConfig = config.configValue;
        cloudinary_1.v2.config({
            cloud_name: cloudinaryConfig.cloudName,
            api_key: cloudinaryConfig.apiKey,
            api_secret: cloudinaryConfig.apiSecret,
        });
    }
    catch (error) {
        logger_1.logger.error("Error loading Cloudinary configuration:", error);
        throw new appError_1.default(500, "Error loading Cloudinary configuration");
    }
};
exports.loadCloudinaryConfig = loadCloudinaryConfig;
