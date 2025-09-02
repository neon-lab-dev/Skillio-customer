"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpConfig = exports.loadOtpConfig = void 0;
const logger_1 = require("../../../utils/logger");
let otpConfig;
const loadOtpConfig = async (configs) => {
    try {
        otpConfig = configs["OTP_CONFIG"];
    }
    catch (error) {
        logger_1.logger.error("Error loading otp configuration:", error);
    }
};
exports.loadOtpConfig = loadOtpConfig;
const getOtpConfig = async () => {
    return otpConfig?.configValue;
};
exports.getOtpConfig = getOtpConfig;
