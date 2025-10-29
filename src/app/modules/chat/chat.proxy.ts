import { Request } from "express";
import { proxyLogging } from "../../utils/proxyLogging";
import chatServices from "./chat.services";
import { TMessage } from "./interface/chat.interface";
import registrationRepository from "../../repository/registrationRepository";
import logger from "../../utils/logger";
import AppError from "../../errors/appError";


class ChatProxy{

    private checkIfProfileExists= async(profileId: string , type: string)=>{
        const existingProfile= await registrationRepository.findProfileById(profileId);

        if(!existingProfile){
            logger.error(`${type} Profile with this Id doesnot exist`);
            throw new AppError(404, `${type} Profile doesnot exist`);
        }
    }

    // create/send message
    createMessage= proxyLogging(
        "ChatProxy",
        "createMessage",
        async(messageData: TMessage, req: Request)=>{
            const { recipientId }= messageData;

            await this.checkIfProfileExists(recipientId , "Recipient");

            return await chatServices.createMessage(messageData , req);
        }
    )

    // get messages between two users
    getMesssages= proxyLogging(
        "ChatProxy",
        "getMesssages",
        async( recipientId:string , before: Date , limit: string , req:Request)=>{

            await this.checkIfProfileExists(recipientId , "Recipient");

            return await chatServices.getMesssages( recipientId , before , limit , req);
        }
    )

}

export default new ChatProxy();