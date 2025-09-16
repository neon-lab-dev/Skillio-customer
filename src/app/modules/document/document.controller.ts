import documentServices from "./services/document.services";
import catchAsyncError from "../../utils/catchAsyncError";
import { Request , Response , NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { DocumentDTO } from "./document.dto";


class DocumentController {

    // create document controller
    createDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const documentData= new DocumentDTO(req.body);

        const result= await documentServices.createDocument({...documentData.toJSON()} , req);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document uploaded successfully",
            data: result
        })
    })

    // update document(profile picture) controller

    updateDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {id}= req.params;

        const result= await documentServices.updateDocument(id , req , res);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document updated successfully",
            data: result
        })
    })

    // delete a document
    deleteDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {id}= req.params;

        const {forceDelete}= req.query ;

        await documentServices.deleteDocument(id , res , forceDelete as string);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document deleted successfully",
            data: null
        })
    })
}

export default new DocumentController();