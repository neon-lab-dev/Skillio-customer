import { logger } from "../../../utils/logger";
import { TDocument } from "../interface/document.interface";
import {  Request } from "express";
import { DocumentStatus } from "../enums/documentEnum";
import documentRepository from "../../../repository/documentRepository";
import { getPublicIdFromUrl } from "../utils/getPublicIdFromCloudinaryUrl";
import cloudinaryServices from "./cloudinaryServices";
import AppError from "../../../errors/appError";
import { getDocumentConfig } from "../config/documentConfig";
import { Document } from "../../../entity/documentEntity";

class DocumentService{

    private getFileNameAndMimeType=(file:Express.Multer.File)=>{
        const fileName= file?.originalname;
        const mimeType= file?.mimetype;
        return {fileName , mimeType};
    }

    private checkFileSize= async(file:Express.Multer.File)=>{
        const documentConfig= await getDocumentConfig();

        if(file.size > documentConfig.maxFileSize){
            logger.error(`File size exceeds the maximum limit.`);
            throw new AppError(400, `File size exceeds the maximum limit.`);
        }

        return;
    }


    // upload a document
    createDocument= async(documentData: Partial<TDocument>  , req: Request)=>{

        const {type, remarks}= documentData;

        await this.checkFileSize(req.file as Express.Multer.File);

        const res= await cloudinaryServices.uploadFile(req.file as Express.Multer.File);

        const url= res.url;

        const{fileName , mimeType}= this.getFileNameAndMimeType(req.file as Express.Multer.File);

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
    updateDocument= async(id:string , req:Request , existingDocument:Document)=>{
        
        await this.checkFileSize(req.file as Express.Multer.File);
        
        const result= await cloudinaryServices.uploadFile(req.file as Express.Multer.File);

        const url= result.url;

        const{fileName , mimeType}= this.getFileNameAndMimeType(req.file as Express.Multer.File);

        const publicId = getPublicIdFromUrl(existingDocument!.url);

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


    // delete multiple documents
    deleteDocuments= async(ids:string[] , forceDelete:boolean , existingDocuments:Document[])=>{

        if(forceDelete==true){
            const publicIds= existingDocuments!.map(doc=> getPublicIdFromUrl(doc.url) as string);

            await Promise.all(publicIds.map(publicId=> cloudinaryServices.deleteFile(publicId)));

            await documentRepository.deleteDocuments(ids);
        }else{
            const documentIdsToBeSoftDeleted = existingDocuments!
                .filter(doc => doc.status !== DocumentStatus.DELETED)
                .map(doc => doc.id as string);

            if(documentIdsToBeSoftDeleted.length===0){
                logger.error("All documents are already soft deleted");
                throw new AppError(400, "All documents are already soft deleted");
            }

            await documentRepository.updateDocuments(documentIdsToBeSoftDeleted as string[] , { status: DocumentStatus.DELETED});
        }
    }

}

export default new DocumentService();