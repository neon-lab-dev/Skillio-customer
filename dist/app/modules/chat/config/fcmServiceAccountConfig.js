"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFcmServiceAccountConfig = exports.loadFcmServiceAccountConfig = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
const logger_1 = require("../../../utils/logger");
let fcmSerivceAccountConfig;
const loadFcmServiceAccountConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("fcmServiceAccountKey");
        if (!config) {
            logger_1.logger.error("fcm service account configuration not found");
            throw new appError_1.default(500, "Fcm service account configuration not found");
        }
        fcmSerivceAccountConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading fcm service account configuration:", error);
        throw new appError_1.default(500, "Error loading fcm service account configuration");
    }
};
exports.loadFcmServiceAccountConfig = loadFcmServiceAccountConfig;
const getFcmServiceAccountConfig = () => {
    try {
        if (!fcmSerivceAccountConfig) {
            logger_1.logger.error("fcm service account configuration not loaded");
            throw new appError_1.default(500, "fcm service account configuration not loaded");
        }
        return fcmSerivceAccountConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting fcm service account configuration:", error);
        throw new appError_1.default(500, "Error getting fcm service account configuration");
    }
};
exports.getFcmServiceAccountConfig = getFcmServiceAccountConfig;
