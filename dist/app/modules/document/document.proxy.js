"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const document_services_1 = __importDefault(require("./services/document.services"));
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
const documentRepository_1 = __importDefault(require("../../repository/documentRepository"));
class DocumentProxy {
    constructor() {
        this.checkExistingDocument = async (id) => {
            const exisitingDocument = await documentRepository_1.default.findOneById(id);
            if (!exisitingDocument) {
                logger_1.logger.error("Document with this id does not exist");
                throw new appError_1.default(404, "Document with this id does not exist");
            }
            return exisitingDocument;
        };
        this.checkExistingDocuments = async (ids) => {
            const existingDocuments = await documentRepository_1.default.findByIds(ids);
            if (!existingDocuments || existingDocuments.length === 0) {
                logger_1.logger.error("No documents found for the provided ids");
                throw new appError_1.default(404, "No documents found for the provided ids");
            }
            return existingDocuments;
        };
        // create or upload a documnet
        this.createDocument = async (documentData, req) => {
            return await document_services_1.default.createDocument(documentData, req);
        };
        this.getDocument = async (id) => {
            return await document_services_1.default.getDocument(id);
        };
        // update a document(profile picture)
        this.updateDocument = async (id, req) => {
            const existingDocument = await this.checkExistingDocument(id);
            return await document_services_1.default.updateDocument(id, req, existingDocument);
        };
        // delete multiple documents
        this.deleteDocuments = async (ids, forceDelete) => {
            const existingDocuments = await this.checkExistingDocuments(ids);
            return await document_services_1.default.deleteDocuments(ids, forceDelete, existingDocuments);
        };
    }
}
exports.default = new DocumentProxy();
