import callRepository from "../../../repository/callRepository";
import logger from "../../../utils/logger";
import { sendSinglePushNotification } from "../../../utils/pushNotification";
import { getIO , onlineUsers } from "../../../utils/sockets";
import { status } from "../enums/callEnum";
import { iceCandidatePayload } from "../interface/call.interface";


export const startCall= async(callerId:string , recipientId:string ,callId:string , offer:any , registrationToken:string)=>{ 
   const io = getIO();

   const socketId= onlineUsers.get(recipientId);

    if(socketId){
        io.to(socketId).emit("incomingCall" , {
            callerId,
            recipientId,
            callId,
            offer
            }
        )
        await callRepository.updateCall(callId , {offer , callStatus: status.RINGING})

        logger.info(`calling reciever:${recipientId}`)
    }else{
        sendSinglePushNotification(callerId,{
            text: "you have recieved a call"
        },"call", registrationToken )
    }
}

export const acceptCall=(callerId:string,callId:string , answer:JSON)=>{
    const io = getIO();

    const socketId= onlineUsers.get(callerId);

    if(socketId){
        io.to(socketId).emit("answer" , {
            callId,
            answer
        })

        logger.info(`answering call: ${callId}`)
    }
}

export const sendIceCandidate= (userId:string , callId:string, iceCandidate:iceCandidatePayload)=>{
    const io = getIO();

    const socketId= onlineUsers.get(userId);

    if(socketId){
        io.to(socketId).emit("iceCandidate" , {
            callId,
            iceCandidate
        })
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