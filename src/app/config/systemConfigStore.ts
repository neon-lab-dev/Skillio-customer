import { AppDataSource } from "../db/dataSource";
import { SystemConfig } from "../entity/systemConfig";
import { logger } from "../utils/logger";
import { loadOtpConfig } from "../modules/verification/config/otpConfig";
import { loadVerificationConfig } from "../modules/verification/config/verificationAttemptsConfig";
import { loadTwoFactorConfig } from "../modules/notification/config/twoFactorConfig";

class SystemConfigStore{
    private static configs: Record<string, SystemConfig> = {};

    loadConfigs = async () => {
        try {
            const repository = AppDataSource.getRepository(SystemConfig);
            const allConfigs = await repository.find();

            SystemConfigStore.configs = {};

            allConfigs.forEach((config)=>{
                SystemConfigStore.configs[config.configKey] = config;
            })


            await loadOtpConfig(SystemConfigStore.configs)

            await loadVerificationConfig(SystemConfigStore.configs)

            await loadTwoFactorConfig(SystemConfigStore.configs)

        } catch (error) {
            logger.error("Error loading system  configurations:", error);
            console.error("Error loading system configurations:", error);
        }
    }
 
}

export default new SystemConfigStore();