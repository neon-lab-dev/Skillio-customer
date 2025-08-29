"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../../errors/appError"));
const logger_1 = require("../../../utils/logger");
const notificationEnum_1 = require("../../../enums/notificationEnum");
const communicationService_1 = __importDefault(require("./communicationService"));
const notificationRepository_1 = __importDefault(require("../../../repository/notificationRepository"));
class NotificationService {
    constructor() {
        // send notfication
        this.createNotification = async (notificationData) => {
            const { medium, to, bodyText, attachments } = notificationData;
            if (!medium || !bodyText || !to) {
                throw new appError_1.default(400, "Missing required fields: medium, bodyText, and at least one of phone/email/deviceToken");
            }
            let notification = await notificationRepository_1.default.createNotification({ medium, to, bodyText, attachments });
            if (!notification) {
                logger_1.logger.error("Failed to create notification entity");
                throw new appError_1.default(500, "Failed to create notification");
            }
            const res = await communicationService_1.default.sendNotification(notification);
            if (res.ok) {
                await notificationRepository_1.default.update(notification.id, { status: notificationEnum_1.Status.SENT });
            }
            else {
                await notificationRepository_1.default.update(notification.id, { status: notificationEnum_1.Status.FAILED });
            }
            notification = await notificationRepository_1.default.findOne(notification.id);
            return { notification: {
                    notification,
                    res
                } };
        };
    }
}
exports.default = new NotificationService();
