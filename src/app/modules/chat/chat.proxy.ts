import { Request } from "express";
import { proxyLogging } from "../../utils/proxyLogging";
import chatServices from "./chat.services";
import { TMessage } from "./interface/chat.interface";
import registrationRepository from "../../repository/registrationRepository";
import logger from "../../utils/logger";
import AppError from "../../errors/appError";
import chatRepository from "../../repository/chatRepository";
import conversationRepository from "../../repository/conversationRepository";
import conversationParticipantRepository from "../../repository/conversationParticipantRepository";

class ChatProxy {
  private checkIfProfileExists = async (profileId: string, type: string) => {
    const existingProfile = await registrationRepository.findProfileById(
      profileId
    );

    if (!existingProfile) {
      logger.error(`${type} Profile with this Id doesnot exist`);
      throw new AppError(404, `${type} Profile doesnot exist`);
    }
  };

  private checkExistingConversation= async(conversationId:string)=>{
    const existingConversation= await conversationRepository.getConversationById(conversationId);

    if(!existingConversation){
      logger.error("Conversation not found");
      throw new AppError(404 , "Conversation not found");
    }
  }

  // create/send message
  createMessage = proxyLogging(
    "ChatProxy",
    "createMessage",
    async (messageData: TMessage, req: Request) => {
      const { recipientId } = messageData;

      await this.checkIfProfileExists(recipientId, "Recipient");

      return await chatServices.createMessage(messageData, req);
    }
  );

  // get messages between two users
  getMesssages = proxyLogging(
    "ChatProxy",
    "getMesssages",
    async (conversationId: string, before: string, limit: string, req: Request) => {

      await this.checkExistingConversation(conversationId);

      const profileId= req.user.profileId;

      const existingConversationParticipant= await conversationParticipantRepository.getConversationParticipant(profileId , conversationId)

      if(!existingConversationParticipant ){
        logger.error("Unauthorized access");
        throw new AppError(403 , "Unauthorized access");
      }

      return await chatServices.getMesssages(conversationId, before, limit, req);
    }
  );

  // get conversations
  getConversations = proxyLogging(
    "ChatProxy",
    "getConversations",
    async (page: string , limit:string, req: Request) => {
      return await chatServices.getConversations(page , limit,req);
    }
  );

  // soft delete conversation
  softDeleteConversation = proxyLogging(
    "ChatProxy",
    "updateConversation",
    async(id:string , req:Request)=>{
      await this.checkExistingConversation(id);

      return await chatServices.softDeleteConversation(id , req);
    })

  // soft delete message
  softDeleteMessage = proxyLogging(
    "ChatProxy",
    "softDeleteMessage",
    async (id: string, req: Request) => {
      const message = await chatRepository.findMessageById(id);

      if (!message) {
        logger.error("Message not found");
        throw new AppError(404, "Message not found");
      }

      const profileId = req.user.profileId;

      if (message.senderId !== profileId) {
        logger.error("unauthorized access");
        throw new AppError(403, "unauthorized access");
      }

      if (message.isDeleted === true) {
        logger.error("Message already deleted");
        throw new AppError(400, "Message already deleted");
      }

      return await chatServices.softDeleteMessage(message);
    }
  );
}

export default new ChatProxy();
