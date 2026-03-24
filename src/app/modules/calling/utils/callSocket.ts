import { LoggerService } from "@neon-lab-dev/platform";
import callRepository from "../../../repository/callRepository";
import { sendSinglePushNotification } from "../../../utils/pushNotification";
import { getIO , onlineUsers } from "../../../utils/sockets";
import { status } from "../enums/callEnum";
import registrationServices from "../../registration/registration.services";


export const startCall= async(callerId:string , recipientId:string ,callId:string , registrationToken:string)=>{ 
    const io = getIO();
    
    const socketId= onlineUsers.get(recipientId);

    const caller= await registrationServices.getShortProfile(callerId);
    const name= caller.name? caller.name: caller.profile?.groupName;
    
        io.to(socketId!).emit("incomingCall" , {
            callerId,
            callId,
            name
            }
        )
        await callRepository.updateCall(callId , {  callStatus: status.RINGING})

        LoggerService.info(`calling reciever:${recipientId}`)

        sendSinglePushNotification(callerId,{
            text: `you have recieved a call from ${name}`,
            callId: callId
        },"call", registrationToken )
}

export const acceptCall=(callerId:string,callId:string)=>{
    const io = getIO();

    const socketId= onlineUsers.get(callerId);

    if(socketId){
        io.to(socketId).emit("answer" , {
            callId
        })

        LoggerService.info(`answering call: ${callId}`)
    }
}


export const rejectCall=(callerId:string , callId:string)=>{
    const io=getIO();

    const socketId=onlineUsers.get(callerId)    ;

    if(socketId){
        io.to(socketId).emit("callRejected" , {
            callId,
            callRejected:true
        })
    }
}

export const endCall=(userId:string, callId:string)=>{
    const io = getIO();

    const socketId=onlineUsers.get(userId);

    if(socketId){
        io.to(socketId).emit("endCall" , {
            callId,
            callEnded:true
        })
    }
}