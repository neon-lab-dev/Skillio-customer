"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtConfig = exports.loadJwtConfig = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
const logger_1 = require("../../../utils/logger");
let jwtConfig;
const loadJwtConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("JWT");
        if (!config) {
            logger_1.logger.error("Jwt configuration not found");
            throw new appError_1.default(500, "Jwt configuration not found");
        }
        jwtConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading jwt configuration:", error);
        throw new appError_1.default(500, "Error loading jwt configuration");
    }
};
exports.loadJwtConfig = loadJwtConfig;
const getJwtConfig = async () => {
    try {
        if (!jwtConfig) {
            logger_1.logger.error("jwt configuration not loaded");
            throw new appError_1.default(500, "jwt configuration not loaded");
        }
        return jwtConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting jwt configuration:", error);
        throw new appError_1.default(500, "Error getting jwt configuration");
    }
};
exports.getJwtConfig = getJwtConfig;
