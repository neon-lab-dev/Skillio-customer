"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderFactory = void 0;
const appError_1 = __importDefault(require("../errors/appError"));
const logger_1 = require("../utils/logger");
const TwilioSmsProvider_1 = require("./TwilioSmsProvider");
class ProviderFactory {
    constructor() {
        this.registry = [];
        this.resolve = (notificaion) => {
            const provider = this.registry.find(p => p.medium === notificaion.medium);
            if (!provider) {
                logger_1.logger.error(`No provider found for medium: ${notificaion.medium}`);
                throw new appError_1.default(500, `No provider found for medium: ${notificaion.medium}`);
            }
            return provider || null;
        };
        this.registry = [
            new TwilioSmsProvider_1.TwilioSmsProvider()
        ];
    }
}
exports.ProviderFactory = ProviderFactory;
