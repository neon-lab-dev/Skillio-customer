"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
const systemConfig_1 = require("../entity/systemConfig");
const logger_1 = require("../utils/logger");
const twilioConfig_1 = require("../modules/notification/config/twilioConfig");
class SystemConfigStore {
    constructor() {
        this.loadConfigs = async () => {
            try {
                const repository = dataSource_1.AppDataSource.getRepository(systemConfig_1.SystemConfig);
                const allConfigs = await repository.find();
                SystemConfigStore.configs = {};
                allConfigs.forEach(config => {
                    SystemConfigStore.configs[config.medium] = config;
                });
                // load twilio config
                try {
                    await (0, twilioConfig_1.loadTwilioConfig)(allConfigs);
                }
                catch (error) {
                    logger_1.logger.error("Error loading Twilio configuration:", error);
                }
                // load other provider configurations similarly
            }
            catch (error) {
                logger_1.logger.error("Error loading provider configurations:", error);
                console.error("Error loading provider configurations:", error);
            }
        };
    }
}
SystemConfigStore.configs = {};
exports.default = new SystemConfigStore();
