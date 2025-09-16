import { logger } from "../../../utils/logger";
import { TDocument } from "../interface/document.interface";
import {  Request, Response } from "express";
import { DocumentStatus } from "../enums/documentEnum";
import documentRepository from "../../../repository/documentRepository";
import { getPublicIdFromUrl } from "../utils/getPublicIdFromCloudinaryUrl";
import cloudinaryServices from "./cloudinaryServices";
import AppError from "../../../errors/appError";

class DocumentService{

    private checkExistingDocument= async(id:string , res:Response)=>{
        const exisitingDocument= await documentRepository.findOneById(id);

        if(!exisitingDocument){
            logger.error("Document with this id does not exist");
            throw new AppError(404, "Document with this id does not exist");
        }

        return exisitingDocument;
    }

    private checkExistingDocuments= async(ids:string[] , res:Response)=>{  
        const existingDocuments= await documentRepository.findByIds(ids);
        if(!existingDocuments || existingDocuments.length===0){
            logger.error("No documents found for the provided ids");
            throw new AppError(404, "No documents found for the provided ids");
        }

        return existingDocuments;
    }

    private getFileNameAndMimeType=(file:Express.Multer.File)=>{
        const fileName= file?.originalname;
        const mimeType= file?.mimetype;
        return {fileName , mimeType};
    }


    // upload a document
    createDocument= async(documentData: Partial<TDocument>  , req: Request)=>{

        const {type, remarks}= documentData;

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
    updateDocument= async(id:string , req:Request , res:Response)=>{
        
        const exisitingDocument=await this.checkExistingDocument(id , res);
        
        const result= await cloudinaryServices.uploadFile(req.file as Express.Multer.File);

        const url= result.url;

        const{fileName , mimeType}= this.getFileNameAndMimeType(req.file as Express.Multer.File);

        const publicId = getPublicIdFromUrl(exisitingDocument!.url);

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
        const exisitingDocument=await this.checkExistingDocument(id , res);

        if(forceDelete=="true"){
            const publicId= getPublicIdFromUrl(exisitingDocument!.url);
            await cloudinaryServices.deleteFile(publicId as string);

            await documentRepository.deleteDocument(id);
        }else{
            if(exisitingDocument!.status===DocumentStatus.DELETED){
                logger.error("Document is already soft deleted");
                throw new AppError(400, "Document is already soft deleted");
            }
            await documentRepository.updateDocument(id , { status: DocumentStatus.DELETED});
        }

    } 

    // delete multiple documents
    deleteDocuments= async(ids:string[] , res:Response , forceDelete:boolean)=>{
        const existingDocuments=await this.checkExistingDocuments(ids , res);

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