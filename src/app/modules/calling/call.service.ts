import callRepository from "../../repository/callRepository";
import { status } from "./enums/callEnum";
import { acceptCall, endCall, rejectCall, startCall } from "./utils/callSocket";
import { serviceLogging } from "../../utils/serviceLogging";
import { Request } from "express";
import conversationParticipantRepository from "../../repository/conversationParticipantRepository";
import { hasSameId } from "../chat/utils/checkIfConversationExists";
import conversationRepository from "../../repository/conversationRepository";
import { Call } from "../../entity/call";
import { GetCallDTO } from "./call.dto";
import callProviderFactory from "./managers/callProviderFactory";
import { FetchTokenRequest } from "./models/request/fetchTokenRequest";

class CallService{

    // create a call
    createCall= serviceLogging(
        "callService",
        "createCall",
        async(recipientId:string , registrationToken: string,req:Request)=>{

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

            startCall(call.callerId , call.recipientId ,call.id , registrationToken || " ")

            return call;
        }
    )
  
    // accept call
    acceptCall= 
        serviceLogging(
        "callService",
        "acceptCall",
        async(call:Call )=>{
             await callRepository.updateCall(call.id , { callStatus: status.ACCEPTED});
            
            acceptCall(call.callerId , call.id )
    
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

    public async getToken(req: FetchTokenRequest): Promise<string>{
        const callProvider=await callProviderFactory.get(req.provider);
        const token= await callProvider.getToken(req.callerId)
        return token;
    }
}

export default new CallService;