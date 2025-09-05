"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpConfig = exports.loadOtpConfig = void 0;
const logger_1 = require("../../../utils/logger");
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
let otpConfig;
const loadOtpConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("OTP_CONFIG");
        if (!config) {
            logger_1.logger.error("OTP configuration not found");
            throw new appError_1.default(500, "OTP configuration not found");
        }
        otpConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading otp configuration:", error);
        throw new appError_1.default(500, "Error loading otp configuration");
    }
};
exports.loadOtpConfig = loadOtpConfig;
const getOtpConfig = async () => {
    try {
        if (!otpConfig) {
            logger_1.logger.error("OTP configuration not loaded");
            throw new appError_1.default(500, "OTP configuration not loaded");
        }
        return otpConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting otp configuration:", error);
        throw new appError_1.default(500, "Error getting otp configuration");
    }
};
exports.getOtpConfig = getOtpConfig;
