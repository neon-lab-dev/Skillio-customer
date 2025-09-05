"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationConfig = exports.loadVerificationConfig = void 0;
const logger_1 = require("../../../utils/logger");
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
let verificationConfig;
const loadVerificationConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("VERIFICATION");
        if (!config) {
            logger_1.logger.error("Verification configuration not found");
            throw new appError_1.default(500, "Verification configuration not found");
        }
        verificationConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading verification configuration:", error);
        throw new appError_1.default(500, "Error loading verification configuration");
    }
};
exports.loadVerificationConfig = loadVerificationConfig;
const getVerificationConfig = async () => {
    try {
        if (!verificationConfig) {
            logger_1.logger.error("Verification configuration not loaded");
            throw new appError_1.default(500, "Verification configuration not loaded");
        }
        return verificationConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting verification configuration:", error);
        throw new appError_1.default(500, "Error getting verification configuration");
    }
};
exports.getVerificationConfig = getVerificationConfig;
