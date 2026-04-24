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
import { AppValidationError, ERROR_CODES, Loggable } from "@neon-lab-dev/platform";
import { FetchCallsRequest } from "./models/request/fetchCallsRequest";
import { FetchCallResponseDto } from "./models/response/fetchCallResponseDto";
import { FetchCallResponseBuilder } from "./models/builder/fetchCallResponseBuilder";
import registrationServices from "../registration/registration.services";
import { profileService } from "../profile/service.profile";
import planAggregatorService from "../planAggregator/planAggregator.service";
import tokenService from "../token/service/tokenService";

class CallService{

    // create a call
        @Loggable()
        public async createCall(recipientId:string,req:Request){

            const callerId= req.user.profileId

            const loggedInUserProfile= await profileService.fetchWithPortfolio(callerId);

            const planAggregator= await planAggregatorService.fetch({profileId: loggedInUserProfile!.id});

            if(!planAggregator || planAggregator.callLimits===0){
                throw new AppValidationError("can not make a call , please check your subscription status" , ERROR_CODES.ACCESS_DENIED)
            }

            const callerConversationIds= await conversationParticipantRepository.getAllConversationIdsByParticipantId(callerId);
            
            const recipientConversationIds= await conversationParticipantRepository.getAllConversationIdsByParticipantId(recipientId);

            const commonConversation= hasSameId(callerConversationIds , recipientConversationIds);
    
            let call;

            if(commonConversation?.flag){
                const newCall=await callRepository.createCall({
                    callerId,
                    conversationId:commonConversation.id,
                    recipientId,
                    callStatus: status.RINGING
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
                    callStatus: status.RINGING
                })

                call= new GetCallDTO(newCall).toJSON();
            }
            const fcmToken= await tokenService.fetchByUserId({userId: call.recipientId});
            startCall(call.callerId , call.recipientId ,call.id , fcmToken.token || " ")

            return call;
        }
  
    // accept call
        @Loggable()
        public async acceptCall(call:Call ){
             await callRepository.updateCall(call.id , { callStatus: status.ACCEPTED});

             const loggedInUserProfile= await profileService.fetchWithPortfolio(call.callerId);

             await planAggregatorService.reduceCallLimits(loggedInUserProfile.portfolio!.id);
            
            acceptCall(call.callerId , call.id )
    
        }


    // reject call
        @Loggable()
        public async rejectCall(call:Call){
            await callRepository.updateCall(call.id, {callStatus:status.REJECTED , endedAt: new Date()})

            rejectCall(call.callerId , call.id)
        }

    // end call
        @Loggable()
        public async endCall(call:Call){
             await callRepository.updateCall(call.id , {
                callStatus: status.ENDED,
                endedAt:  new Date()
            });
            
            [call.callerId , call.recipientId].forEach((userId)=>{
                endCall(userId , call.id);
            })
    
        }

    @Loggable()
    public async getToken(req: FetchTokenRequest): Promise<string>{
        const callProvider=await callProviderFactory.get(req.provider);
        const token= await callProvider.getToken(req.callerId)
        return token;
    }

    @Loggable()
    public async fetchCalls(req: FetchCallsRequest):Promise<FetchCallResponseDto[]>{
        await registrationServices.authorizeProfile(req.profileId);
        const res= await callRepository.findCalls(req.profileId);
        return FetchCallResponseBuilder.builder().ofArray(res);
    }
}

export default new CallService;