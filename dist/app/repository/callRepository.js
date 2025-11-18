"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class CallRepository {
    constructor() {
        // create a call
        this.createCall = async (callData) => {
            const newCall = this.callRepository.create(callData);
            return await this.callRepository.save(newCall);
        };
        // update a call
        this.updateCall = async (id, callData) => {
            return await this.callRepository.update(id, callData);
        };
        // find by id
        this.findById = async (id) => {
            return await this.callRepository.findOneBy({
                id
            });
        };
        this.callRepository = dataSource_1.AppDataSource.getRepository("Call");
    }
}
exports.default = new CallRepository();
