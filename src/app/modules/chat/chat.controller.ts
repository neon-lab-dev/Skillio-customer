import chatProxy from "./chat.proxy";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../middlewares/sendResponse";
import { Request, Response } from "express";
import { ChaDTO , MessagesDTO } from "./chat.dto";
import { controllerLogging } from "../../utils/controllerLogging";

class ChatController{

    // create/send message
    createMessage= controllerLogging(
        "ChatController.createMessage",
    catchAsyncError(async(req:Request , res:Response)=>{
        const messageData= new ChaDTO(req.body);

        const result= await chatProxy.createMessage(messageData.toJSON() , req)

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Message sent successfully",
            data: result
        })
    }))

    // get messages between two users
    getMesssages= controllerLogging(
        "ChatController.getMesssages",
    catchAsyncError(async(req:Request , res:Response)=>{
        const { recipientId, before}= new MessagesDTO(req.body);

        const limit= req.query.limit as string;

        const result= await chatProxy.getMesssages( recipientId , before , limit , req);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Messages fetched successfully",
            data: result
        })
     }))

    // soft delete message
    softDeleteMessage= controllerLogging(
        "ChatController.softDeleteMessage",
    catchAsyncError(async(req:Request , res:Response)=>{
        const { id }= req.params;
        await chatProxy.softDeleteMessage(id , req);
        
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Message deleted successfully",
        })
     }))

}

export default new ChatController();