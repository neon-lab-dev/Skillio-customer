import { AppDataSource } from "../db/dataSource";
import { SystemConfig } from "../entity/systemConfig";
import { Repository } from "typeorm";

class systemConfigRepository{
    private systemConfigRepository: Repository<SystemConfig>;

    constructor(){
        this.systemConfigRepository = AppDataSource.getRepository<SystemConfig>("system_config");
    }

    // get Configy by key
    getConfigByKey= async (key: string)=>{
        return this.systemConfigRepository.findOneBy({
            configKey: key
        });
    }

}

export default new systemConfigRepository();