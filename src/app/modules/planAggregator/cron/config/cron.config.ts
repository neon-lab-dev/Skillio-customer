import systemConfigRepository from "../../../../repository/systemConfigRepository";
import { LoggerService } from "@neon-lab-dev/platform";
import { NotFoundError } from "@neon-lab-dev/platform";
import { TcronConfig } from "../interface/cron.interface";

let cronConfig: TcronConfig | undefined;

export const loadCronConfig = async () => {
    const config = await systemConfigRepository.getConfigByKey("cron");

    if (!config) {
      LoggerService.error("Cron configuration not found");
      throw new NotFoundError("Cron configuration not found");
    }

    cronConfig = config.configValue as TcronConfig;

};

export const getCronConfig = async (): Promise<TcronConfig> => {
    if(!cronConfig){
      LoggerService.error("Cron configuration not loaded");
      throw new NotFoundError("Cron configuration not loaded");
    }

    return cronConfig;
};
