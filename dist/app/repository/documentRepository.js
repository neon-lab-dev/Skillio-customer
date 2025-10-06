"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class DocumentRepository {
    constructor() {
        // create a document
        this.createDocument = async (documentData) => {
            const newDocument = this.documentRepository.create(documentData);
            return await this.documentRepository.save(newDocument);
        };
        // find one by fileName and mimeType
        this.findOneByFileNameAndMimeType = async (fileName, mimeType) => {
            return await this.documentRepository.findOneBy({
                fileName,
                mimeType
            });
        };
        // find one by id
        this.findOneById = async (id) => {
            return await this.documentRepository.findOneBy({
                id
            });
        };
        // update a document
        this.updateDocument = async (id, updateData) => {
            return await this.documentRepository.update(id, updateData);
        };
        // delete a document by id
        this.deleteDocument = async (id) => {
            return await this.documentRepository.delete(id);
        };
        this.documentRepository = dataSource_1.AppDataSource.getRepository("Document");
    }
}
exports.default = new DocumentRepository();
