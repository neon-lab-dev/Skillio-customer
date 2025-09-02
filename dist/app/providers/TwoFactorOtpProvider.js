"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorOtpProvider = void 0;
const logger_1 = require("../utils/logger");
const notificationEnum_1 = require("../enums/notificationEnum");
const axios_1 = __importDefault(require("axios"));
const twoFactorConfig_1 = require("../modules/notification/config/twoFactorConfig");
const appError_1 = __importDefault(require("../errors/appError"));
class TwoFactorOtpProvider {
    constructor() {
        this.name = "twoFactor";
        this.medium = notificationEnum_1.Medium.SMS;
    }
    async send(notification) {
        try {
            const twoFactorConfig = await (0, twoFactorConfig_1.getTwoFactorConfig)();
            if (!twoFactorConfig) {
                throw new appError_1.default(500, "Two factor configuration not found");
            }
            const url = `${twoFactorConfig.baseUrl}/${twoFactorConfig.apikey}/SMS/${notification.to}/${notification.bodyText}`;
            const res = await axios_1.default.get(url);
            return {
                ok: res.status === 200,
                response: res.data
            };
        }
        catch (error) {
            logger_1.logger.error(`TwoFactorOtpProvider: Failed to send SMS to ${notification.to}:`, error);
            return {
                ok: false,
                response: `Failed to send SMS: ${error}`
            };
        }
    }
}
exports.TwoFactorOtpProvider = TwoFactorOtpProvider;
