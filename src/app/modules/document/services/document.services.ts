import { logger } from "../../../utils/logger";
import { TDocument } from "../interface/document.interface";
import {  Request, Response } from "express";
import { DocumentStatus } from "../enums/documentEnum";
import documentRepository from "../../../repository/documentRepository";
import sendResponse from "../../../middlewares/sendResponse";
import { getPublicIdFromUrl } from "../utils/getPublicIdFromCloudinaryUrl";
import cloudinaryServices from "./cloudinaryServices";

class DocumentService{

    // upload a document
    createDocument= async(documentData: Partial<TDocument>  , req: Request)=>{

        const {type, remarks}= documentData;

        const res= await cloudinaryServices.uploadFile(req.file as Express.Multer.File);

        const fileName= req.file?.originalname;
        const url= res.url;
        const mimeType= req.file?.mimetype;

        const newDocument = await documentRepository.createDocument({
            fileName,
            url,
            mimeType,
            remarks,
            type,
            status: DocumentStatus.UPLOADED
        })

        return {
            document:{
                id: newDocument.id,
                url: newDocument.url,
                type: newDocument.type
            }
        };
    }

    // update a document(profile picture)
    updateDocument= async(id:string , req:Request , res:Response)=>{
        const result= await cloudinaryServices.uploadFile(req.file as Express.Multer.File);

        const fileName= req.file?.originalname;
        const url= result.url;
        const mimeType= req.file?.mimetype;

        const exisitingDocument= await documentRepository.findOneById(id);

        if(!exisitingDocument){
            logger.error(`Document with this id does not exist`);
            return sendResponse(res , {
                statusCode: 404,
                success: false,
                message: `Document with this id does not exist`
            })
        }

        const publicId= getPublicIdFromUrl(exisitingDocument.url);

        await cloudinaryServices.deleteFile(publicId as string);

         await documentRepository.updateDocument(id , {
            fileName,
            url,
            mimeType,
         });

         const updatedDocument= await documentRepository.findOneById(id);

        return {
            updatedDocument:{
                id:  updatedDocument?.id,
                url: updatedDocument?.url,
                type: updatedDocument?.type
            }
        }
    }

    // delete a document
    deleteDocument= async(id:string , res:Response , forceDelete:string)=>{
        const exisitingDocument= await documentRepository.findOneById(id);

        if(!exisitingDocument){
            logger.error(`Document with this id does not exist`);
            return sendResponse(res , {
                statusCode: 404,
                success: false,
                message: `Document with this id does not exist`
            })
        }

        if(forceDelete=="true"){
            const publicId= getPublicIdFromUrl(exisitingDocument.url);
            await cloudinaryServices.deleteFile(publicId as string);

            await documentRepository.deleteDocument(id);
        }else{
            if(exisitingDocument.status===DocumentStatus.DELETED){
                logger.error(`Document is already soft deleted`);
                return sendResponse(res , {
                    statusCode: 400,
                    success: false,
                    message: `Document is already soft deleted`
                })
            }
            await documentRepository.updateDocument(id , { status: DocumentStatus.DELETED});
        }

    } 

}

export default new DocumentService();