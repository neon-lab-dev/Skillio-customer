"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
const systemConfig_1 = require("../entity/systemConfig");
const logger_1 = require("../utils/logger");
const otpConfig_1 = require("../modules/verification/config/otpConfig");
const verificationAttemptsConfig_1 = require("../modules/verification/config/verificationAttemptsConfig");
const twoFactorConfig_1 = require("../modules/notification/config/twoFactorConfig");
class SystemConfigStore {
    constructor() {
        this.loadConfigs = async () => {
            try {
                const repository = dataSource_1.AppDataSource.getRepository(systemConfig_1.SystemConfig);
                const allConfigs = await repository.find();
                SystemConfigStore.configs = {};
                allConfigs.forEach((config) => {
                    SystemConfigStore.configs[config.configKey] = config;
                });
                await (0, otpConfig_1.loadOtpConfig)(SystemConfigStore.configs);
                await (0, verificationAttemptsConfig_1.loadVerificationConfig)(SystemConfigStore.configs);
                await (0, twoFactorConfig_1.loadTwoFactorConfig)(SystemConfigStore.configs);
            }
            catch (error) {
                logger_1.logger.error("Error loading system  configurations:", error);
                console.error("Error loading system configurations:", error);
            }
        };
    }
}
SystemConfigStore.configs = {};
exports.default = new SystemConfigStore();
