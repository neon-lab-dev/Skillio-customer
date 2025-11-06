import chatProxy from "./chat.proxy";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../middlewares/sendResponse";
import { Request, Response } from "express";
import { ChaDTO  } from "./chat.dto";
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

        const conversationId= req.query.conversationId as string;
        
        const limit= req.query.limit as string;

        const before= req.query.before as string;


        const result= await chatProxy.getMesssages( conversationId , before , limit , req);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Messages fetched successfully",
            data: result
        })
     }))

    //  get conversations
    getConversations= controllerLogging(
        "ChatController.getConversations",
    catchAsyncError(async(req:Request , res:Response)=>{
        const page= req.query.page as string;

        const limit= req.query.limit as string;

        const result= await chatProxy.getConversations(page , limit, req);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Conversations fetched successfully",
            data: result
        })
     }))

    //  soft delete conversation
    softDeleteConversation= controllerLogging(
        "ChatController.softDeleteConversation",
    catchAsyncError(async(req:Request , res:Response)=>{
        const { id }= req.params;
        await chatProxy.softDeleteConversation(id , req);
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Conversation deleted successfully",
        })
     }
    ))

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