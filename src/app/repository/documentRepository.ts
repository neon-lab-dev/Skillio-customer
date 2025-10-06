import { AppDataSource } from "../db/dataSource";
import { Repository } from "typeorm";
import { Document } from "../entity/documentEntity";
import { In } from "typeorm";

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


    // find one by id
    findOneById= async(id:string)=>{
        return await this.documentRepository.findOneBy({
            id
        });
    }

    findByIds= async(ids:string[])=>{
        return await this.documentRepository.find({
            where:{
                id: In(ids)
            }
        });
    }

    // update a document
    updateDocument= async(id:string , updateData: Partial<Document>)=>{
        return await this.documentRepository.update(id , updateData);
    }

    // bulk update documents
    updateDocuments= async(ids:string[] , updateData: Partial<Document>)=>{
        return await this.documentRepository.update(ids , updateData);
    }


    // delete a document by id
    deleteDocument= async(id:string)=>{
        return await this.documentRepository.delete(id);
    }

    // bulk delete documents by ids
    deleteDocuments= async(ids:string[])=>{
        return await this.documentRepository.delete(ids);
    }
}


export default new DocumentRepository();