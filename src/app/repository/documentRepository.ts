import { AppDataSource } from "../db/dataSource";
import { Repository } from "typeorm";
import { Document } from "../entity/documentEntity";

class DocumentRepository{

    private documentRepository: Repository<Document>;

    constructor() {
        this.documentRepository = AppDataSource.getRepository<Document>("Document");
    }

    // create a document
    createDocument= async(documentData: Partial<Document>)=>{
        const newDocument=this.documentRepository.create(documentData);
        return await this.documentRepository.save(newDocument);
    }

    // find one by fileName and mimeType
    findOneByFileNameAndMimeType= async(fileName:string , mimeType:string)=>{
        return await this.documentRepository.findOneBy({
            fileName,
            mimeType
        });
    }

    // find one by id
    findOneById= async(id:string)=>{
        return await this.documentRepository.findOneBy({
            id
        });
    }

    // update a document
    updateDocument= async(id:string , updateData: Partial<Document>)=>{
        return await this.documentRepository.update(id , updateData);
    }

    // delete a document by id
    deleteDocument= async(id:string)=>{
        return await this.documentRepository.delete(id);
    }
}


export default new DocumentRepository();