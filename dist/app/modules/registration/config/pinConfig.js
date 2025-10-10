"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPinConfig = exports.loadPinConfig = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
const logger_1 = require("../../../utils/logger");
let pinConfig;
const loadPinConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("PIN");
        if (!config) {
            logger_1.logger.error("Pin configuration not found");
            throw new appError_1.default(500, "Pin configuration not found");
        }
        pinConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading pin configuration:", error);
        throw new appError_1.default(500, "Error loading pin configuration");
    }
};
exports.loadPinConfig = loadPinConfig;
const getPinConfig = async () => {
    try {
        if (!pinConfig) {
            logger_1.logger.error("Pin configuration not loaded");
            throw new appError_1.default(500, "Pin configuration not loaded");
        }
        return pinConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting pin configuration:", error);
        throw new appError_1.default(500, "Error getting pin configuration");
    }
};
exports.getPinConfig = getPinConfig;
