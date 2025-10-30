import chatRepository from "../../repository/chatRepository";
import { sendMessage } from "./utils/chatSocket";
import AppError from "../../errors/appError";
import logger from "../../utils/logger";
import { serviceLogging } from "../../utils/serviceLogging";
import { TMessage } from "./interface/chat.interface";
import { getDocumentConfig } from "../document/config/documentConfig";
import { Request } from "express";
import cloudinaryServices from "../document/services/cloudinaryServices";
import { GetChatDTO } from "./chat.dto";
import { Status } from "./enums/chatEnum";
import { Message } from "../../entity/message";

class ChatService{

    private checkFileSize= async(file:Express.Multer.File)=>{
        const documentConfig= await getDocumentConfig();

        if(file.size > documentConfig.maxFileSize){
            logger.error(`File size exceeds the maximum limit.`);
            throw new AppError(400, `File size exceeds the maximum limit.`);
        }

        return;
    }

    // create/send message
    createMessage= serviceLogging(
        "ChatService",
        "createMessage",
        async ( messageData: TMessage , req: Request)=>{
            const {  recipientId , content , fcmRegistrationToken }= messageData;

            const senderId= req.user.profileId

            let url:string | undefined;

            if(req && req.file){
                await this.checkFileSize(req.file as Express.Multer.File);

                const res= await cloudinaryServices.uploadFile(req.file as Express.Multer.File);

                url= res.url;
            }

            const newMessage= await chatRepository.createMessage({
                senderId,
                recipientId,
                content:{
                    ...content,
                    fileUrl: url
                },
                status: Status.SENT
            })

            await sendMessage(
                newMessage.id,
                senderId,
                recipientId,
                {
                    content,
                    fileUrl: url,
                    timestamp: new Date()
                },
                fcmRegistrationToken || ""
            )


            const message= new GetChatDTO(newMessage).toJSON();

            return message;
        }
    )

    // get messages between two users
    getMesssages= serviceLogging(
        "ChatService",
        "getMesssages",
        async( recipientId:string , before: Date , limit: string , req:Request)=>{
            const senderId= req.user.profileId

            const fetchedMessages= await chatRepository.findMessagesBySenderIdAndRecipientId(
                senderId,
                recipientId,
                before,
                limit
            );

            const unreadMessages= fetchedMessages.filter((
                message=> message.recipientId===senderId && message.status === Status.SENT || message.status === Status.DELIVERED
            ));

            if(unreadMessages.length >0){
                await Promise.all(
                    unreadMessages.map( async(message)=>{
                        await chatRepository.updateMessageById(message.id, {
                            status: Status.READ,
                            readAt: new Date()
                        })
                    })
                )
            }

            const messages=await Promise.all(
                fetchedMessages.map( async(message)=>{
                    return new GetChatDTO(message).toJSON();
                }
            ))

            return messages;
        }
    )

    // soft delete message
    softDeleteMessage= serviceLogging(
        "ChatService",
        "softDeleteMessage",
        async(message:Message)=>{

            await chatRepository.updateMessageById(message.id,{
                isDeleted: true
            })
        }
    )

}

export default new ChatService();