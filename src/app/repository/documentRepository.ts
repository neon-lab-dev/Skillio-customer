import { AppDataSource } from "../db/dataSource";
import { DeepPartial, Repository } from "typeorm";
import { Document } from "../entity/documentEntity";
import { In } from "typeorm";
import { DocumentType } from "../modules/document/enums/documentEnum";

class DocumentRepository{

    private documentRepository: Repository<Document>;

    constructor() {
        this.documentRepository = AppDataSource.getRepository<Document>("Document");
    }

    // create a document
    createDocument= async(documentData: DeepPartial<Document>)=>{
        const newDocument=this.documentRepository.create(documentData);
        return await this.documentRepository.save(newDocument);
    }


    // find one by id
    findOneById= async(id:string)=>{
        return await this.documentRepository.findOne({
            where:{
                id: id
            },
            relations:{portfolio: true}
        },
    );
    }

    findByIds= async(ids:string[])=>{
        return await this.documentRepository.find({
            where:{
                id: In(ids)
            }
        });
    }

    // find by id and documen type
    findByIdAndType= async(id:string , type:DocumentType)=>{
        return await this.documentRepository.findOneBy({
            id,
            type
        });
    }

    // find one by portfolioId and type
    findDocumentIdByPortfolioIdAndType= async(portfolioId:string , type:DocumentType)=>{
        return await this.documentRepository.findOne({
            where: {
                portfolioId,
                type
            },
            select: ["id"]
        });
    }

    async fetchDocumentByPortfolio(portfolioId:string){
        return await this.documentRepository.findBy({portfolioId});
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