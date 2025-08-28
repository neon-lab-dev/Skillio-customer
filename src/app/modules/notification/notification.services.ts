import { TNotification } from "./notification.interface";
import { AppDataSource } from "../../db/dataSource";
import AppError from "../../errors/appError";
import { logger } from "../../utils/logger";
import { Repository } from "typeorm";
import { Medium, Notification , Status } from "../../entity/notification";
import communicationService from "../../services/communicationService";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";

class NotificationService {
    private notificationRepository: Repository<Notification>;

    constructor() {
        this.notificationRepository = AppDataSource.getRepository<Notification>("Notification");
    }

    // send notfication
    createNotification= async(notificationData: Partial<TNotification>)=>{
        const { medium, bodyText, attachments } = notificationData;
        let phone , email , deviceToken;

        if(medium==="SMS"){
            phone=notificationData.phone;
        }else if(medium==="EMAIL"){
            email=notificationData.email;
        }else if(medium==="PUSH_NOTIFICATION"){
            deviceToken=notificationData.deviceToken;
        }

        if(!medium || !bodyText || !(phone|| email || deviceToken)){
            throw new AppError(400, "Missing required fields: medium, bodyText, and at least one of phone/email/deviceToken");
        }

        let newNotification;

        if(medium==="SMS" && phone){
             newNotification = this.notificationRepository.create({
                medium,
                phone,
                bodyText,
                attachments,
                status: Status.IN_PROGRESS
            });
        }

        if(medium==="EMAIL" && email){
             newNotification = this.notificationRepository.create({
                medium,
                email,
                bodyText,
                attachments,
                status: Status.IN_PROGRESS
            });
        }

        if(medium==="PUSH_NOTIFICATION" && deviceToken){
             newNotification = this.notificationRepository.create({
                medium,
                deviceToken,
                bodyText,
                attachments,
                status: Status.IN_PROGRESS
            });
        }


        if(!newNotification) {
            logger.error("Failed to create notification entity");
            throw new AppError(500, "Failed to create notification");
        }

        let notification = await this.notificationRepository.save(newNotification);

        const res=await communicationService.sendNotification(notification)

        if(res.ok){
            await this.notificationRepository.update(
                { id: notification.id },
                { status: Status.SENT }
            );
        }else{
            await this.notificationRepository.update(
                { id: notification.id },
                { status: Status.FAILED }
            );
        }

        notification= await this.notificationRepository.findOneBy({id: notification.id}) as Notification;

        return {notification:{
            notification,
            res
        }};
    }


    // get all notifcations
    getAllNotifications= async(res:Response)=>{
        const notifications= await this.notificationRepository.find(
            {
                order: {
                    createdAt: "DESC"
                }
            }
        );

        if(!notifications || notifications.length===0){
            logger.error("Failed to fetch notifications");
            return sendResponse(res , {
                statusCode: 404,
                success: false,
                message: "No notifications found",
                data: null
            })
        }

        return notifications;
    }

    // get notification by id
    getNotificaionById= async(notificationId:string , res:Response)=>{
        if(!notificationId){
            logger.error("Notification ID is required");
            return sendResponse(res , {
                statusCode: 400,
                success: false,
                message: "Notification ID is required",
                data: null
            })
        }

        const notification= await this.notificationRepository.findOneBy({id: notificationId});

        if(!notification){
            logger.error("Notification not found");
            return sendResponse(res , {
                statusCode: 404,
                success: false,
                message: "Notification not found",
                data: null
            })
        }

        return notification;
    }

    // get notification by medium
    getNotificationsByMedium= async(medium:Medium , res:Response)=>{
        if(!medium){
            logger.error("Medium is required");
            throw new AppError(400, "Medium is required");
        }

        const notifications= await this.notificationRepository.findBy({medium});

        if(!notifications || notifications.length===0){
            logger.error("No notifications found for the specified medium");
            return sendResponse(res , {
                statusCode: 404,
                success: false,
                message: "No notifications found for the specified medium",
                data: null
            })
        }

        return notifications;
    }


    // get notification by status
    getNotificationsByStatus= async(status:Status , res:Response)=>{
        if(!status){
            logger.error("Status is required");
            throw new AppError(400, "Status is required");
        }

        const notifications= await this.notificationRepository.findBy({status});

        if(!notifications || notifications.length===0){
            logger.error("No notifications found for the specified status");
            return sendResponse(res , {
                statusCode: 404,
                success: false,
                message: "No notifications found for the specified status",
                data: null
            })
        }

        return notifications;
    }

}

export default new NotificationService();