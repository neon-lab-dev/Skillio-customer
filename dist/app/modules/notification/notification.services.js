"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../../db/dataSource");
const appError_1 = __importDefault(require("../../errors/appError"));
const logger_1 = require("../../utils/logger");
const notification_1 = require("../../entity/notification");
const communicationService_1 = __importDefault(require("../../services/communicationService"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
class NotificationService {
    constructor() {
        // send notfication
        this.createNotification = async (notificationData) => {
            const { medium, bodyText, attachments } = notificationData;
            let phone, email, deviceToken;
            if (medium === "SMS") {
                phone = notificationData.phone;
            }
            else if (medium === "EMAIL") {
                email = notificationData.email;
            }
            else if (medium === "PUSH_NOTIFICATION") {
                deviceToken = notificationData.deviceToken;
            }
            if (!medium || !bodyText || !(phone || email || deviceToken)) {
                throw new appError_1.default(400, "Missing required fields: medium, bodyText, and at least one of phone/email/deviceToken");
            }
            let newNotification;
            if (medium === "SMS" && phone) {
                newNotification = this.notificationRepository.create({
                    medium,
                    phone,
                    bodyText,
                    attachments,
                    status: notification_1.Status.IN_PROGRESS
                });
            }
            if (medium === "EMAIL" && email) {
                newNotification = this.notificationRepository.create({
                    medium,
                    email,
                    bodyText,
                    attachments,
                    status: notification_1.Status.IN_PROGRESS
                });
            }
            if (medium === "PUSH_NOTIFICATION" && deviceToken) {
                newNotification = this.notificationRepository.create({
                    medium,
                    deviceToken,
                    bodyText,
                    attachments,
                    status: notification_1.Status.IN_PROGRESS
                });
            }
            if (!newNotification) {
                logger_1.logger.error("Failed to create notification entity");
                throw new appError_1.default(500, "Failed to create notification");
            }
            let notification = await this.notificationRepository.save(newNotification);
            const res = await communicationService_1.default.sendNotification(notification);
            if (res.ok) {
                await this.notificationRepository.update({ id: notification.id }, { status: notification_1.Status.SENT });
            }
            else {
                await this.notificationRepository.update({ id: notification.id }, { status: notification_1.Status.FAILED });
            }
            notification = await this.notificationRepository.findOneBy({ id: notification.id });
            return { notification: {
                    notification,
                    res
                } };
        };
        // get all notifcations
        this.getAllNotifications = async (res) => {
            const notifications = await this.notificationRepository.find({
                order: {
                    createdAt: "DESC"
                }
            });
            if (!notifications || notifications.length === 0) {
                logger_1.logger.error("Failed to fetch notifications");
                return (0, sendResponse_1.default)(res, {
                    statusCode: 404,
                    success: false,
                    message: "No notifications found",
                    data: null
                });
            }
            return notifications;
        };
        // get notification by id
        this.getNotificaionById = async (notificationId, res) => {
            if (!notificationId) {
                logger_1.logger.error("Notification ID is required");
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Notification ID is required",
                    data: null
                });
            }
            const notification = await this.notificationRepository.findOneBy({ id: notificationId });
            if (!notification) {
                logger_1.logger.error("Notification not found");
                return (0, sendResponse_1.default)(res, {
                    statusCode: 404,
                    success: false,
                    message: "Notification not found",
                    data: null
                });
            }
            return notification;
        };
        // get notification by medium
        this.getNotificationsByMedium = async (medium, res) => {
            if (!medium) {
                logger_1.logger.error("Medium is required");
                throw new appError_1.default(400, "Medium is required");
            }
            const notifications = await this.notificationRepository.findBy({ medium });
            if (!notifications || notifications.length === 0) {
                logger_1.logger.error("No notifications found for the specified medium");
                return (0, sendResponse_1.default)(res, {
                    statusCode: 404,
                    success: false,
                    message: "No notifications found for the specified medium",
                    data: null
                });
            }
            return notifications;
        };
        // get notification by status
        this.getNotificationsByStatus = async (status, res) => {
            if (!status) {
                logger_1.logger.error("Status is required");
                throw new appError_1.default(400, "Status is required");
            }
            const notifications = await this.notificationRepository.findBy({ status });
            if (!notifications || notifications.length === 0) {
                logger_1.logger.error("No notifications found for the specified status");
                return (0, sendResponse_1.default)(res, {
                    statusCode: 404,
                    success: false,
                    message: "No notifications found for the specified status",
                    data: null
                });
            }
            return notifications;
        };
        this.notificationRepository = dataSource_1.AppDataSource.getRepository("Notification");
    }
}
exports.default = new NotificationService();
