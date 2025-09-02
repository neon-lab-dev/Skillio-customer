"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVerificationConfig = exports.loadVerificationConfig = void 0;
const logger_1 = require("../../../utils/logger");
let verificationConfig;
const loadVerificationConfig = async (configs) => {
    try {
        verificationConfig = configs["VERIFICATION"];
    }
    catch (error) {
        logger_1.logger.error("Error loading verification configuration:", error);
    }
};
exports.loadVerificationConfig = loadVerificationConfig;
const getVerificationConfig = async () => {
    return verificationConfig?.configValue;
};
exports.getVerificationConfig = getVerificationConfig;
