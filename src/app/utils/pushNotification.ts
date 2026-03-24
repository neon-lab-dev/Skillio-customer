import { content } from "../modules/chat/interface/chat.interface";
import logger from "./logger";
import registrationRepository from "../repository/registrationRepository";
import { initializeFirebase , getMessaging } from "../config/firebaseConfig";


export const sendSinglePushNotification = async (callerId:string,content: Partial<content> ,type:string, registrationToken:string)=>{
    const profile= await registrationRepository.findProfileById(callerId);

    const message={
        data:{
            title: `${type} from ${profile?.firstName} ${profile?.lastName}`,
            body: content.text || "You have received a new message",
            callerId: callerId,
            callId: content.callId as string | ""
        },
        token: registrationToken
    }

    try{
         initializeFirebase()

        const messaging= getMessaging();

        if(messaging){
                messaging.send(message).then((res)=>{
                    logger.info(`Push notification sent successfully: ${res}`);
                })
                 .catch((error)=>{
                logger.error("Error sending push notification", error);
                })
        }
    }catch(error){
        logger.error("Error sending push notification", error);
    }
}