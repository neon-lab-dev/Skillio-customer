"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const otpConfig_1 = require("../modules/verification/config/otpConfig");
const verificationAttemptsConfig_1 = require("../modules/verification/config/verificationAttemptsConfig");
const twoFactorConfig_1 = require("../modules/notification/config/twoFactorConfig");
class SystemConfigStore {
    constructor() {
        this.loadConfigs = async () => {
            try {
                await (0, otpConfig_1.loadOtpConfig)();
                await (0, verificationAttemptsConfig_1.loadVerificationConfig)();
                await (0, twoFactorConfig_1.loadTwoFactorConfig)();
            }
            catch (error) {
                logger_1.logger.error("Error loading system  configurations:", error);
                console.error("Error loading system configurations:", error);
            }
        };
    }
}
exports.default = new SystemConfigStore();
