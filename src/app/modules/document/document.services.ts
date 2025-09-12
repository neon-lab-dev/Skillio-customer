import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { TDocument } from "./interface/document.interface";
import { Response } from "express";
import { DocumentStatus } from "./enums/documentEnum";
import documentRepository from "../../repository/documentRepository";
import sendResponse from "../../middlewares/sendResponse";
import { getPublicIdFromUrl } from "./utils/getPublicIdFromCloudinaryUrl";
import { v2 as cloudinary } from "cloudinary";

class DocumentService{

    // upload a document
    createDocument= async(documentData: Partial<TDocument>)=>{

        const {fileName , url, mimeType ,type, remarks}= documentData;

        if(!fileName || !url || !mimeType || !type){
            logger.error("fileName, url and mimeType are required");
            throw new AppError(400, "fileName, url and mimeType are required");
        }

        const exisitingDocument= await documentRepository.findOneByFileNameAndMimeType(fileName , mimeType);

        if(exisitingDocument){
            logger.error(`Document with this fileName and mimeType already exists`);
            throw new AppError(400, `Document with this fileName and mimeType already exists`);
        }

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

    // update a document 
    updateDocument= async(id:string , updateData: Partial<TDocument> , res:Response)=>{
        const { fileName , url , mimeType}= updateData;

        if(!fileName || !url || !mimeType){
            logger.error("fileName, url and mimeType are required");
            throw new AppError(400, "fileName, url and mimeType are required");
        }

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

        cloudinary.uploader
        .destroy(publicId as string)
        .then(result => console.log(result));

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
    deleteDocument= async(id:string ,forceDelete:boolean, res:Response)=>{
        const exisitingDocument= await documentRepository.findOneById(id);

        if(!exisitingDocument){
            logger.error(`Document with this id does not exist`);
            return sendResponse(res , {
                statusCode: 404,
                success: false,
                message: `Document with this id does not exist`
            })
        }

        if(forceDelete==true){
            await documentRepository.deleteDocument(id);
        }else{
            await documentRepository.updateDocument(id , { status: DocumentStatus.DELETED});
        }

    } 

}

export default new DocumentService();