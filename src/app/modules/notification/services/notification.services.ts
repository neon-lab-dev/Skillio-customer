import { TNotification } from "../interface/notification.interface";
import AppError from "../../../errors/appError";
import { logger } from "../../../utils/logger";
import {  Status } from "../enums/notificationEnum";
import { Notification } from "../../../entity/notification";
import communicationService from "./communicationService";
import notificationRepository from "../../../repository/notificationRepository";

class NotificationService {
    private  updateNotificationStatus=async(notificationId: string, status: Status) =>{
        return await notificationRepository.update(notificationId, { status });
    }

    // send notfication
    createNotification= async(notificationData: Partial<TNotification>)=>{
        try{
            const { medium,to, bodyText, attachments } = notificationData;
    
    
            if(!medium || !bodyText || !to){
                throw new AppError(400, "Missing required fields: medium, bodyText, and at least one of phone/email/deviceToken");
            }
    
            let notification= await notificationRepository.createNotification({medium , to , bodyText , attachments});
    
            await this.updateNotificationStatus(
                notification.id,
                Status.IN_PROGRESS
            )
    
            const res=await communicationService.sendNotification(notification)
    
            // make thesese update functions as private methods
            if(res.ok){
                await this.updateNotificationStatus(
                    notification.id,
                    Status.SENT
                );
            }else{
                await this.updateNotificationStatus(
                    notification.id,
                    Status.FAILED
                );
            }
    
            notification= await notificationRepository.findOne(notification.id) as Notification;
    
            return {notification:{
                notification,
                res
            }};
        }catch(error){
            logger.error("NotificationService: Failed to create and send notification:", error);
            throw new AppError(500, "Failed to create and send notification");
        }
    }

}

export default new NotificationService();