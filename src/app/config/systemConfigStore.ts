import { AppDataSource } from "../db/dataSource";
import { SystemConfig } from "../entity/systemConfig";
import { logger } from "../utils/logger";
import { loadTwilioConfig } from "../modules/notification/config/twilioConfig";

class SystemConfigStore{
    private static configs: Record<string, SystemConfig> = {};

    loadConfigs = async () => {
        try {
            const repository = AppDataSource.getRepository(SystemConfig);
            const allConfigs = await repository.find();

            SystemConfigStore.configs = {};

            allConfigs.forEach(config => {
                SystemConfigStore.configs[config.medium] = config;
            });

            // load twilio config
            try{
                await loadTwilioConfig(allConfigs);
            }catch(error){
                logger.error("Error loading Twilio configuration:", error);
            }

            // load other provider configurations similarly


        } catch (error) {
            logger.error("Error loading provider configurations:", error);
            console.error("Error loading provider configurations:", error);
        }
    }
 
}

export default new SystemConfigStore();