"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class OnlineRepository {
    constructor() {
        this.upsertOnlineStatus = async (profileId, onlineData) => {
            return await this.onlineRepository.upsert({
                profileId,
                ...onlineData
            }, ["profileId"]);
        };
        this.updateByProfileId = async (profileId, onlineData) => {
            return await this.onlineRepository.update({
                profileId
            }, onlineData);
        };
        this.onlineRepository = dataSource_1.AppDataSource.getRepository("Online");
    }
}
exports.default = new OnlineRepository();
