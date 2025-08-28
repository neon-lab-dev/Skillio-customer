import notificationServices from "./notification.services";
import { Request, Response, NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import catchAsyncError from "../../utils/catchAsyncError";
import { notificationDTO } from "./notification.dto";


class NotificationController {

    // create notification controller
    createNotification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
        const notificationData= new notificationDTO(req.body);

        const result = await notificationServices.createNotification(notificationData.toJSON());

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Notification created and processed successfully",
            data: result,
        });
    });

    // get all notifications controller
    getAllNotifications = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
        const result = await notificationServices.getAllNotifications(res);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Notifications fetched successfully",
            data: result,
        });
    });

    // get notification by id controller
    getNotificaionById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
        const { notificationId } = req.params;

        const result = await notificationServices.getNotificaionById(notificationId, res);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Notification fetched successfully",
            data: result,
        });
    });

    // get notification by medium controller
    getNotificationByMedium = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
        const { medium } = req.body;

        const result = await notificationServices.getNotificationsByMedium(medium, res);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Notifications fetched successfully",
            data: result,
        });
    })


    // get notification by status controller
    getNotificationsByStatus = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
        const { status } = req.body;

        const result = await notificationServices.getNotificationsByStatus(status, res);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Notifications fetched successfully",
            data: result,
        });
    });
}

export default new NotificationController();

