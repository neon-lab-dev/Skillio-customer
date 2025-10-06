import catchAsyncError from "../../utils/catchAsyncError";
import { Request , Response , NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { DocumentDTO } from "./document.dto";
import documentProxy from "./document.proxy";


class DocumentController {

    // create document controller
    createDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const documentData= new DocumentDTO(req.body);

        const result= await documentProxy.createDocument({...documentData.toJSON()} , req);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document uploaded successfully",
            data: result
        })
    })

    // update document(profile picture) controller

    updateDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {id}= req.body;

        const result= await documentProxy.updateDocument(id , req );

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

        await documentProxy.deleteDocument(id , forceDelete as string);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document deleted successfully",
        })
    })

    // delete multiple documents
    deleteDocuments= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {ids , forceDelete}= req.body;

        await documentProxy.deleteDocuments(ids , forceDelete);
        
        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Documents deleted successfully",
        })
    })

}

export default new DocumentController();