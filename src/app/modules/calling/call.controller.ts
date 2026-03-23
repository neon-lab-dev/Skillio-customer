import callProxy from "./call.proxy";
import sendResponse from "../../middlewares/sendResponse";
import { controllerLogging } from "../../utils/controllerLogging";
import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response } from "express";

class callController{

    // create a call
    createCall=controllerLogging(
        "callController.createCall",
        catchAsyncError(async(req:Request , res:Response , )=>{
            const {recipientId}=req.body;

            const result= await callProxy.createCall(recipientId  , req)

            return sendResponse(res , {
                success: true, 
                statusCode:200,
                message:"calling created sucessfully",
                data: result
            })
        })
    )

    // accept call
    accecptCall= controllerLogging(
        "callController.acceptCall",
        catchAsyncError(async(req:Request , res:Response)=>{
            const{callId }=req.body;

            await callProxy.acceptCall(callId  , req);

            return sendResponse(res , {
                success: true,
                statusCode:200,
                message:"call accepted",
            })
        })
    )

    rejectCall=controllerLogging(
        "callController.rejectCall",
        catchAsyncError(async(req:Request , res:Response)=>{
            const {callId}=req.body;

            await callProxy.rejectCall(callId , req);

            return sendResponse(res , {
                success:true,
                statusCode:200,
                message:"call rejected"
            })
        })
    )

    // end call
    endCall= controllerLogging(
        "callController.endCall",
        catchAsyncError(async(req:Request , res:Response)=>{
            const {callId}=req.body;

            await callProxy.endCall(callId);

            return sendResponse(res , {
                success:true, 
                statusCode: 200,
                message:"call ended",
            })
        })
    )
}

export default new callController;