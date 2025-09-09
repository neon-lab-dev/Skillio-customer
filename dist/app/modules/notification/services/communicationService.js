"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationProviderFactory_1 = __importDefault(require("../../../providers/NotificationProviderFactory"));
class communicationService {
    async sendNotification(notification) {
        // 1. Factory resolves correct provider (SMS, EMAIL, PUSH)
        const provider = NotificationProviderFactory_1.default.resolve(notification);
        if (!provider) {
            throw new Error("No provider found for the specified medium");
        }
        // 2. Provider (strategy) executes send
        return await provider.send(notification);
    }
}
exports.default = new communicationService();
