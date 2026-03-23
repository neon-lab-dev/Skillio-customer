import {  Request } from "express";
import { proxyLogging } from "../../utils/proxyLogging";
import callService from "./call.service";
import callRepository from "../../repository/callRepository";
import logger from "../../utils/logger";
import AppError from "../../errors/appError";
import registrationRepository from "../../repository/registrationRepository";
import { status } from "./enums/callEnum";

class CallProxy{

    private checkExistingCall=async(id:string)=>{
        const existingCall= await callRepository.findById(id);
        if(!existingCall){
            logger.error("call not found");
            throw new AppError(404 , "call not found")
        }

        return existingCall;
    }

    private checkExistingProfile=async(profileId:string)=>{
        const existingProfile= await registrationRepository.findProfileById(profileId);

        if(!existingProfile){
            logger.error("profile not found");
            throw new AppError(404 , "profile not found")
        }

        return;
    }

    // create a call
    createCall= proxyLogging(
        "callProxy",
        "createCall",
        async(recipientId:string, req:Request)=>{
            await this.checkExistingProfile(recipientId);
            
            return await callService.createCall(recipientId , req);
        }
    ) 


    // accept call
    acceptCall= proxyLogging(
        "callProxy",
        "acceptCall",
        async( callId:string , req:Request)=>{
            const call= await this.checkExistingCall(callId);

            if(call.callStatus!=status.RINGING){
                logger.error("cannot accept call ")
                throw new AppError(409, "cannot accept call")
            }

            const recipientId=req.user.profileId;

            if(call.recipientId!= recipientId){
                logger.error("unauthorized access");
                throw new AppError(409, "unauthorized access")
            }

            return await callService.acceptCall( call);
        }
    )

    // reject call
    rejectCall= proxyLogging(
        "callProxy",
        "rejectCall",
        async(callId:string , req:Request)=>{
            const call= await this.checkExistingCall(callId);

            if(call.callStatus!= status.RINGING){
                logger.error("can not reject call")
                throw new AppError(409, "can not reject call")
            }

            const recipientId= req.user.profileId;

            if(recipientId!= call.recipientId){
                logger.error("unauthorized access")
                throw new AppError(409 , "unauthorized access")
            }

            return await callService.rejectCall(call)
        }
    )

    // end call
    endCall= proxyLogging(
        "callProxy",
        "endCall",
        async(callId:string)=>{
            const call= await this.checkExistingCall(callId);

            if(call.callStatus!=status.ACCEPTED){
                logger.error("can not end call")
                throw new AppError(409, "can not end call")
            }

            return await callService.endCall(call)
        }
    )

}

export default  new CallProxy;