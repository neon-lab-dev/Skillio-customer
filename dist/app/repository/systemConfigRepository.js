"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class systemConfigRepository {
    constructor() {
        // get Configy by key
        this.getConfigByKey = async (key) => {
            return await this.systemConfigRepository.findOneBy({
                configKey: key
            });
        };
        this.systemConfigRepository = dataSource_1.AppDataSource.getRepository("system_config");
    }
}
exports.default = new systemConfigRepository();
