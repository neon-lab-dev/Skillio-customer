import callRepository from "../../repository/callRepository";
import { status } from "./enums/callEnum";
import { acceptCall, endCall, rejectCall, sendIceCandidate, startCall } from "./utils/callSocket";
import { serviceLogging } from "../../utils/serviceLogging";
import { Request } from "express";
import conversationParticipantRepository from "../../repository/conversationParticipantRepository";
import { hasSameId } from "../chat/utils/checkIfConversationExists";
import conversationRepository from "../../repository/conversationRepository";
import { Call } from "../../entity/call";
import { GetCallDTO } from "./call.dto";
import { iceCandidatePayload } from "./interface/call.interface";

class CallService{

    // create a call
    createCall= serviceLogging(
        "callService",
        "createCall",
        async(recipientId:string,req:Request)=>{

            const callerId= req.user.profileId

            const callerConversationIds= await conversationParticipantRepository.getAllConversationIdsByParticipantId(callerId);
            
            const recipientConversationIds= await conversationParticipantRepository.getAllConversationIdsByParticipantId(recipientId);

            const commonConversation= hasSameId(callerConversationIds , recipientConversationIds);
    
            let call;

            if(commonConversation?.flag){
                const newCall=await callRepository.createCall({
                    callerId,
                    conversationId:commonConversation.id,
                    recipientId,
                    callStatus: status.CALLING
                })
                call= new GetCallDTO(newCall).toJSON();

            }else{
                const conversation= await conversationRepository.createConversation();

                await conversationParticipantRepository.createConversationParticipant({
                    conversationId: conversation.id,
                    participantId: callerId
                })  

                await conversationParticipantRepository.createConversationParticipant({
                    conversationId: conversation.id,
                    participantId: recipientId
                })
                
                const newCall= await callRepository.createCall({
                    callerId,
                    conversationId: conversation.id,
                    recipientId,
                    callStatus: status.CALLING
                })

                call= new GetCallDTO(newCall).toJSON();
            }

            return call;
        }
    )
  
    // update call with offer
    updateCall= serviceLogging(
        "callService" , 
        "updateCall",
        async(call:Call , offer:any , registrationToken:string )=>{
    
            startCall(call.callerId , call.recipientId ,call.id, offer , registrationToken || " ")
    
        }
    )

    // accept call
    acceptCall= 
        serviceLogging(
        "callService",
        "acceptCall",
        async(call:Call, answer:any )=>{
             await callRepository.updateCall(call.id , {answer , callStatus: status.ACCEPTED});
            
            acceptCall(call.callerId , call.id , answer)
    
        }
    )


    // reject call
    rejectCall=serviceLogging(
        "callService",
        "rejectCall",
        async(call:Call)=>{
            await callRepository.updateCall(call.id, {callStatus:status.REJECTED , endedAt: new Date()})

            rejectCall(call.callerId , call.id)
        }
    )

    // end call
    endCall= 
        serviceLogging(
        "callService",
        "endCall",
        async(call:Call)=>{
             await callRepository.updateCall(call.id , {
                callStatus: status.ENDED,
                endedAt:  new Date()
            });
            
            [call.callerId , call.recipientId].forEach((userId)=>{
                endCall(userId , call.id);
            })
    
        }
    )

    // send ice candidate
    sendIceCandidate= 
        serviceLogging(
        "callService",
        "sendIceCandidate",
        async(profileId:string,callId:string, iceCandidate:iceCandidatePayload)=>{

            sendIceCandidate(profileId,callId, iceCandidate);
        }
    )

}

export default new CallService;