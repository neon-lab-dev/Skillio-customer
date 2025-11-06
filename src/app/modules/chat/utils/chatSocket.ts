import chatRepository from "../../../repository/chatRepository";
import logger from "../../../utils/logger";
import { sendSinglePushNotification } from "../../../utils/pushNotification";
import { getIO , onlineUsers } from "../../../utils/sockets";
import { Status } from "../enums/chatEnum";

export const sendMessage=async(id:string,senderId:string,recipientId:string , content:any , registrationToken:string)=>{
    const io= getIO();

    const socketId= onlineUsers.get(recipientId);

    if(socketId){
        io.to(socketId).emit("message" , content);

        await chatRepository.updateMessageById(id, {
            status: Status.DELIVERED
        })

        logger.info(`Message sent to recipientId: ${recipientId}, socketId: ${socketId}`);
    }else{
        sendSinglePushNotification(senderId,content, registrationToken);
    }
}