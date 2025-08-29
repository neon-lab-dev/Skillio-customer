import notificationServices from "./services/notification.services";
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

}

export default new NotificationController();

