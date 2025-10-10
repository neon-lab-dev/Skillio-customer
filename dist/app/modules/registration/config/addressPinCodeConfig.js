"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressPinCodeConfig = exports.loadAddressPinConfig = void 0;
const appError_1 = __importDefault(require("../../../errors/appError"));
const systemConfigRepository_1 = __importDefault(require("../../../repository/systemConfigRepository"));
const logger_1 = require("../../../utils/logger");
let addressPinConfig;
const loadAddressPinConfig = async () => {
    try {
        const config = await systemConfigRepository_1.default.getConfigByKey("MAX_ADDRESS_PIN_CODE");
        if (!config) {
            logger_1.logger.error("Address pin code configuration not found");
            throw new appError_1.default(500, "Address pin code configuration not found");
        }
        addressPinConfig = config.configValue;
    }
    catch (error) {
        logger_1.logger.error("Error loading address pin code configuration:", error);
        throw new appError_1.default(500, "Error loading address pin code configuration");
    }
};
exports.loadAddressPinConfig = loadAddressPinConfig;
const getAddressPinCodeConfig = async () => {
    try {
        if (!addressPinConfig) {
            logger_1.logger.error("Address pin code configuration not loaded");
            throw new appError_1.default(500, "Address pin code configuration not loaded");
        }
        return addressPinConfig;
    }
    catch (error) {
        logger_1.logger.error("Error getting address pin code configuration:", error);
        throw new appError_1.default(500, "Error getting address pin code configuration");
    }
};
exports.getAddressPinCodeConfig = getAddressPinCodeConfig;
