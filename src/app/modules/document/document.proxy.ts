import documentServices from "./services/document.services"
import { TDocument } from "./interface/document.interface"
import { Request } from "express"
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import documentRepository from "../../repository/documentRepository";

class DocumentProxy{

    private checkExistingDocument= async(id:string )=>{
        const exisitingDocument= await documentRepository.findOneById(id);

        if(!exisitingDocument){
            logger.error("Document with this id does not exist");
            throw new AppError(404, "Document with this id does not exist");
        }

        return exisitingDocument;
    }

    private checkExistingDocuments= async(ids:string[])=>{  
        const existingDocuments= await documentRepository.findByIds(ids);
        if(!existingDocuments || existingDocuments.length===0){
            logger.error("No documents found for the provided ids");
            throw new AppError(404, "No documents found for the provided ids");
        }

        return existingDocuments;
    }

    // create or upload a documnet
    createDocument= async(documentData: Partial<TDocument>  , req: Request)=>{
        return await documentServices.createDocument(documentData , req);
    }

    // update a document(profile picture)
    updateDocument= async(id:string , req:Request)=>{
        const existingDocument=await this.checkExistingDocument(id);

        return await documentServices.updateDocument(id , req , existingDocument);
    }

    // delete a document
    deleteDocument= async(id:string  , forceDelete:string)=>{
        if(!id){
            logger.error("Document ID is required");
            throw new AppError(400, "Document ID is required");
        }

        const existingDocument=await this.checkExistingDocument(id );


        return await documentServices.deleteDocument(id , forceDelete , existingDocument);
    }


    // delete multiple documents
    deleteDocuments= async(ids:string[] , forceDelete:boolean)=>{
        const existingDocuments=await this.checkExistingDocuments(ids);

        return await documentServices.deleteDocuments(ids , forceDelete , existingDocuments);
    }

}

export default new DocumentProxy();