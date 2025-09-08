"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../errors/appError"));
const logger_1 = require("../utils/logger");
const TwoFactorOtpProvider_1 = require("./TwoFactorOtpProvider");
class ProviderFactory {
    constructor() {
        // initialize all the providers at runtime
        this.initializeProviders = () => {
            ProviderFactory.twoFactorOtpProvider = new TwoFactorOtpProvider_1.TwoFactorOtpProvider();
        };
        this.resolve = (notificaion) => {
            switch (notificaion.medium) {
                case "SMS":
                    return ProviderFactory.twoFactorOtpProvider;
                default:
                    logger_1.logger.error(`ProviderFactory: No provider found for medium ${notificaion.medium}`);
                    throw new appError_1.default(400, "No provider found for the specified medium");
            }
        };
    }
}
exports.default = new ProviderFactory();
