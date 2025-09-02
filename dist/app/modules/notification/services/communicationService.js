"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationProviderFactory_1 = require("../../../providers/NotificationProviderFactory");
class communicationService {
    constructor() {
        this.providerFactory = new NotificationProviderFactory_1.ProviderFactory();
    }
    async sendNotification(notification) {
        // 1. Factory resolves correct provider (SMS, EMAIL, PUSH)
        const provider = this.providerFactory.resolve(notification);
        if (!provider) {
            throw new Error("No provider found for the specified medium");
        }
        // 2. Provider (strategy) executes send
        return await provider.send(notification);
    }
}
exports.default = new communicationService();
