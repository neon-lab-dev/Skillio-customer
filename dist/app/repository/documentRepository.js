"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
const typeorm_1 = require("typeorm");
class DocumentRepository {
    constructor() {
        // create a document
        this.createDocument = async (documentData) => {
            const newDocument = this.documentRepository.create(documentData);
            return await this.documentRepository.save(newDocument);
        };
        // find one by id
        this.findOneById = async (id) => {
            return await this.documentRepository.findOneBy({
                id
            });
        };
        this.findByIds = async (ids) => {
            return await this.documentRepository.find({
                where: {
                    id: (0, typeorm_1.In)(ids)
                }
            });
        };
        // find by id and documen type
        this.findByIdAndType = async (id, type) => {
            return await this.documentRepository.findOneBy({
                id,
                type
            });
        };
        // find one by portfolioId and type
        this.findDocumentIdByPortfolioIdAndType = async (portfolioId, type) => {
            return await this.documentRepository.findOne({
                where: {
                    portfolioId,
                    type
                },
                select: ["id"]
            });
        };
        // update a document
        this.updateDocument = async (id, updateData) => {
            return await this.documentRepository.update(id, updateData);
        };
        // bulk update documents
        this.updateDocuments = async (ids, updateData) => {
            return await this.documentRepository.update(ids, updateData);
        };
        // delete a document by id
        this.deleteDocument = async (id) => {
            return await this.documentRepository.delete(id);
        };
        // bulk delete documents by ids
        this.deleteDocuments = async (ids) => {
            return await this.documentRepository.delete(ids);
        };
        this.documentRepository = dataSource_1.AppDataSource.getRepository("Document");
    }
}
exports.default = new DocumentRepository();
