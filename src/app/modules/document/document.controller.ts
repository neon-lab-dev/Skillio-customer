import documentServices from "./document.services";
import catchAsyncError from "../../utils/catchAsyncError";
import { Request , Response , NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { DocumentDTO } from "./document.dto";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { v2 as cloudinary } from "cloudinary";


class DocumentController {

    // create document controller
    createDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const documentData= new DocumentDTO(req.body);

        let fileName: string | undefined;
        let url: string | undefined;
        let mimeType: string | undefined;

        if(req.file){
            try{
                const res= await cloudinary.uploader.upload(
                     `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                         {
                            folder: "skilioDocument"
                        }
                )
                fileName= req.file.originalname;
                url= res.url;
                mimeType= req.file.mimetype;
            }catch(error){
                logger.error("Error uploading file to Cloudinary:", error);
                throw new AppError(500, "Error uploading file to Cloudinary");
            }
        }


        const result= await documentServices.createDocument({...documentData.toJSON() , fileName, url, mimeType});

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document uploaded successfully",
            data: result
        })
    })

    // update document controller

    updateDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {id}= req.params;

        let fileName: string | undefined;
        let url: string | undefined;
        let mimeType: string | undefined;

        if(req.file){
            try{
                const res= await cloudinary.uploader.upload(
                     `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                         {
                            folder: "skilioDocument"
                        }
                )
                fileName= req.file.originalname;
                url= res.url;
                mimeType= req.file.mimetype;
            }catch(error){
                logger.error("Error uploading file to Cloudinary:", error);
                throw new AppError(500, "Error uploading file to Cloudinary");
            }
        }

        const result= await documentServices.updateDocument(id , { fileName, url, mimeType} , res);


        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document updated successfully",
            data: result
        })
    })

    deleteDocument= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {id}= req.params;

        const {forceDelete}= req.body;

        await documentServices.deleteDocument(id ,forceDelete, res);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Document deleted successfully",
            data: null
        })
    })
}

export default new DocumentController();