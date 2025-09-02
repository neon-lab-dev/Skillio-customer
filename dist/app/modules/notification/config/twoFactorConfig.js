"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwoFactorConfig = exports.loadTwoFactorConfig = void 0;
const logger_1 = require("../../../utils/logger");
let twoFactorConfig;
const loadTwoFactorConfig = async (configs) => {
    try {
        twoFactorConfig = configs["TWO_FACTOR"];
    }
    catch (error) {
        logger_1.logger.error("Error loading two factor configuration:", error);
    }
};
exports.loadTwoFactorConfig = loadTwoFactorConfig;
const getTwoFactorConfig = async () => {
    return twoFactorConfig?.configValue;
};
exports.getTwoFactorConfig = getTwoFactorConfig;
