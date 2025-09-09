"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwoFactorConfig = exports.loadTwoFactorConfig = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
const logger_1 = require("../../../utils/logger");
let twoFactorConfig;
const loadTwoFactorConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("TWO_FACTOR");
        if (!config) {
            logger_1.logger.error("Two factor configuration not found");
            throw new appError_1.default(500, "Two factor configuration not found");
        }
        twoFactorConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading two factor configuration:", error);
        throw new appError_1.default(500, "Error loading two factor configuration");
    }
};
exports.loadTwoFactorConfig = loadTwoFactorConfig;
const getTwoFactorConfig = async () => {
    try {
        if (!twoFactorConfig) {
            logger_1.logger.error("Two factor configuration not loaded");
            throw new appError_1.default(500, "Two factor configuration not loaded");
        }
        return twoFactorConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting two factor configuration:", error);
        throw new appError_1.default(500, "Error getting two factor configuration");
    }
};
exports.getTwoFactorConfig = getTwoFactorConfig;
