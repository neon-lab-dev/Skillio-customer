import { TNotification } from "../interface/notification.interface";
import AppError from "../../../errors/appError";
import { logger } from "../../../utils/logger";
import {  Status } from "../enums/notificationEnum";
import { Notification } from "../../../entity/notification";
import communicationService from "./communicationService";
import notificationRepository from "../../../repository/notificationRepository";
import { Loggable, Pageable } from "@neon-lab-dev/platform";
import { NotificatinSearchCriteria } from "../models/request/searchCriteria/notificationSearchCriteria";
import { NotificationSpecification } from "../specification/notificationSpecification";
import { NotificationDtoBuilder } from "../models/builders/builder.notification.dto";

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

    @Loggable()
    public async fetch(req:NotificatinSearchCriteria ){
        const spec= new NotificationSpecification(req);

        const entityPage= await notificationRepository.findPage(spec, req);

        const notifications= NotificationDtoBuilder.builder().ofArray(entityPage.items);

        return Pageable.buildPage(notifications , entityPage.total , req);

    }


}

export default new NotificationService();