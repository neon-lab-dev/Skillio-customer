import { AppDataSource } from "../db/dataSource";
import { SystemConfig } from "../entity/systemConfig";
import { laodTwilioConfig } from "./twilioConfig";

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

            await laodTwilioConfig(allConfigs);

        } catch (error) {
            console.error("Error loading provider configurations:", error);
        }
    }
 
}

export default new SystemConfigStore();