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
import conversationParticipantRepository from "../../repository/conversationParticipantRepository";
import { hasSameId } from "./utils/checkIfConversationExists";
import conversationRepository from "../../repository/conversationRepository";

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

            const senderConversationIds= await conversationParticipantRepository.getAllConversationIdsByParticipantId(senderId);

            const recipientConversationIds= await conversationParticipantRepository.getAllConversationIdsByParticipantId(recipientId);

            const commonConversation= hasSameId(senderConversationIds , recipientConversationIds);

            let message;

            if(commonConversation?.flag){
                const newMessage= await chatRepository.createMessage({
                    senderId,
                    recipientId,
                    content:{
                        ...content,
                        fileUrl: url
                    },
                    status: Status.SENT,
                    conversationId: commonConversation.id
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

                await conversationRepository.updateConversationById(commonConversation.id, {
                    updatedAt: new Date()
                })

                const existingConversationParticipant= await conversationParticipantRepository.getConversationParticipant(
                    senderId,
                    commonConversation.id
                )

                if(existingConversationParticipant?.deletedAt && existingConversationParticipant?.deletedAt > existingConversationParticipant.joinedAt){
                    await conversationParticipantRepository.updateConversationParticipant(
                        senderId,
                        commonConversation.id,
                        { joinedAt: new Date() }
                    )
                }


                message= new GetChatDTO(newMessage).toJSON();
            }else{
                const conversation= await conversationRepository.createConversation();

                await conversationParticipantRepository.createConversationParticipant({
                    conversationId: conversation.id,
                    participantId: senderId
                })

                await conversationParticipantRepository.createConversationParticipant({
                    conversationId: conversation.id,
                    participantId: recipientId
                })

                const newMessage= await chatRepository.createMessage({
                    senderId,
                    recipientId,
                    content:{
                        ...content,
                        fileUrl: url
                    },
                    status: Status.SENT,
                    conversationId: conversation.id
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
                message= new GetChatDTO(newMessage).toJSON();
            }

            return message;
        }
    )

    // get messages between two users
    getMesssages= serviceLogging(
        "ChatService",
        "getMesssages",
        async( conversationId:string , before: string , limit: string , req:Request)=>{
            const senderId= req.user.profileId

            const fetchedMessages= await chatRepository.findMessagesByConversationId(
                conversationId,
                senderId,
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

    // get conversations
    getConversations= serviceLogging(
        "ChatService",
        "getConversations",
        async(page: string , limit:string, req:Request )=>{
            const profileId= req.user.profileId;
            const conversationIds= await conversationParticipantRepository.getPaginatedConversationIdsByParticipantId(profileId , page , limit);

            if(conversationIds.length===0){
                return [];
            }

            const participantIds= await conversationParticipantRepository.getAllParticipantIdsByConversationIds(conversationIds , profileId);

            const messages= await Promise.all(
                conversationIds.map(async(conversationId)=>{
                    return await conversationRepository.getConversationByIdWithLatestMessage(conversationId);
                }) 
            )

            const participantWithMessages= participantIds.map((participantId , index)=>{
                return{
                    participantId,
                    conversationId: conversationIds[index],
                    latestMessage: messages[index]
                }
            })

            return participantWithMessages;
    })

    // soft delete conversation
    softDeleteConversation= serviceLogging(
        "ChatService",
        "softDeleteConversation",
        async(conversationId:string , req:Request )=>{
            const profileId= req.user.profileId;

            await conversationParticipantRepository.updateConversationParticipant(
                profileId,
                conversationId,
                {
                    deletedAt: new Date()
                }
            )
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