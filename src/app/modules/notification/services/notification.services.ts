import { TNotification } from "../interface/notification.interface";
import AppError from "../../../errors/appError";
import { logger } from "../../../utils/logger";
import {  Status } from "../../../enums/notificationEnum";
import { Notification } from "../../../entity/notification";
import communicationService from "./communicationService";
import notificationRepository from "../../../repository/notificationRepository";

class NotificationService {

    // send notfication
    createNotification= async(notificationData: Partial<TNotification>)=>{
        const { medium,to, bodyText, attachments } = notificationData;


        if(!medium || !bodyText || !to){
            throw new AppError(400, "Missing required fields: medium, bodyText, and at least one of phone/email/deviceToken");
        }

        let notification= await notificationRepository.createNotification({medium , to , bodyText , attachments});


        if(!notification) {
            logger.error("Failed to create notification entity");
            throw new AppError(500, "Failed to create notification");
        }

        const res=await communicationService.sendNotification(notification)

        if(res.ok){
            await notificationRepository.update(
                notification.id,
                { status: Status.SENT }
            );
        }else{
            await notificationRepository.update(
                notification.id,
                { status: Status.FAILED }
            );
        }

        notification= await notificationRepository.findOne(notification.id) as Notification;

        return {notification:{
            notification,
            res
        }};
    }

}

export default new NotificationService();