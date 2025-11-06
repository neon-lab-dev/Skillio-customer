"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const otpConfig_1 = require("../modules/verification/config/otpConfig");
const verificationAttemptsConfig_1 = require("../modules/verification/config/verificationAttemptsConfig");
const twoFactorConfig_1 = require("../modules/notification/config/twoFactorConfig");
const cloudinaryConfig_1 = require("../modules/document/config/cloudinaryConfig");
const documentConfig_1 = require("../modules/document/config/documentConfig");
const jwtConfig_1 = require("../modules/registration/config/jwtConfig");
const pinConfig_1 = require("../modules/registration/config/pinConfig");
const addressPinCodeConfig_1 = require("../modules/registration/config/addressPinCodeConfig");
const fcmServiceAccountConfig_1 = require("../modules/chat/config/fcmServiceAccountConfig");
class SystemConfigStore {
    constructor() {
        this.loadConfigs = async () => {
            try {
                await (0, otpConfig_1.loadOtpConfig)();
                await (0, verificationAttemptsConfig_1.loadVerificationConfig)();
                await (0, twoFactorConfig_1.loadTwoFactorConfig)();
                await (0, cloudinaryConfig_1.loadCloudinaryConfig)();
                await (0, documentConfig_1.loadDocumentConfig)();
                await (0, jwtConfig_1.loadJwtConfig)();
                await (0, pinConfig_1.loadPinConfig)();
                await (0, addressPinCodeConfig_1.loadAddressPinConfig)();
                await (0, fcmServiceAccountConfig_1.loadFcmServiceAccountConfig)();
            }
            catch (error) {
                logger_1.logger.error("Error loading system  configurations:", error);
                console.error("Error loading system configurations:", error);
            }
        };
    }
}
exports.default = new SystemConfigStore();
