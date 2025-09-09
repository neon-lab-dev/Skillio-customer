"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_services_1 = __importDefault(require("./services/notification.services"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const notification_dto_1 = require("./notification.dto");
class NotificationController {
    constructor() {
        // create notification controller
        this.createNotification = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const notificationData = new notification_dto_1.notificationDTO(req.body);
            const result = await notification_services_1.default.createNotification(notificationData.toJSON());
            (0, sendResponse_1.default)(res, {
                statusCode: 201,
                success: true,
                message: "Notification created and processed successfully",
                data: result,
            });
        });
    }
}
exports.default = new NotificationController();
