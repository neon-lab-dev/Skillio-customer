"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../../errors/appError"));
const logger_1 = require("../../../utils/logger");
const notificationEnum_1 = require("../enums/notificationEnum");
const communicationService_1 = __importDefault(require("./communicationService"));
const notificationRepository_1 = __importDefault(require("../../../repository/notificationRepository"));
class NotificationService {
    constructor() {
        this.updateNotificationStatus = async (notificationId, status) => {
            return await notificationRepository_1.default.update(notificationId, { status });
        };
        // send notfication
        this.createNotification = async (notificationData) => {
            try {
                const { medium, to, bodyText, attachments } = notificationData;
                if (!medium || !bodyText || !to) {
                    throw new appError_1.default(400, "Missing required fields: medium, bodyText, and at least one of phone/email/deviceToken");
                }
                let notification = await notificationRepository_1.default.createNotification({ medium, to, bodyText, attachments });
                await this.updateNotificationStatus(notification.id, notificationEnum_1.Status.IN_PROGRESS);
                const res = await communicationService_1.default.sendNotification(notification);
                if (res.ok) {
                    await this.updateNotificationStatus(notification.id, notificationEnum_1.Status.SENT);
                }
                else {
                    await this.updateNotificationStatus(notification.id, notificationEnum_1.Status.FAILED);
                }
                notification = await notificationRepository_1.default.findOne(notification.id);
                return { notification: {
                        notification,
                        res
                    } };
            }
            catch (error) {
                logger_1.logger.error("NotificationService: Failed to create and send notification:", error);
                throw new appError_1.default(500, "Failed to create and send notification");
            }
        };
    }
}
exports.default = new NotificationService();
