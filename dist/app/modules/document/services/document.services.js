"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../utils/logger");
const documentEnum_1 = require("../enums/documentEnum");
const documentRepository_1 = __importDefault(require("../../../repository/documentRepository"));
const getPublicIdFromCloudinaryUrl_1 = require("../utils/getPublicIdFromCloudinaryUrl");
const cloudinaryServices_1 = __importDefault(require("./cloudinaryServices"));
const appError_1 = __importDefault(require("../../../errors/appError"));
const documentConfig_1 = require("../config/documentConfig");
class DocumentService {
    constructor() {
        this.getFileNameAndMimeType = (file) => {
            const fileName = file?.originalname;
            const mimeType = file?.mimetype;
            return { fileName, mimeType };
        };
        this.checkFileSize = async (file) => {
            const documentConfig = await (0, documentConfig_1.getDocumentConfig)();
            if (file.size > documentConfig.maxFileSize) {
                logger_1.logger.error(`File size exceeds the maximum limit.`);
                throw new appError_1.default(400, `File size exceeds the maximum limit.`);
            }
            return;
        };
        // upload a document
        this.createDocument = async (documentData, req) => {
            const { type, remarks } = documentData;
            await this.checkFileSize(req.file);
            const res = await cloudinaryServices_1.default.uploadFile(req.file);
            const url = res.url;
            const { fileName, mimeType } = this.getFileNameAndMimeType(req.file);
            const newDocument = await documentRepository_1.default.createDocument({
                fileName,
                url,
                mimeType,
                remarks,
                type,
                status: documentEnum_1.DocumentStatus.UPLOADED
            });
            return {
                document: {
                    id: newDocument.id,
                    url: newDocument.url,
                    type: newDocument.type
                }
            };
        };
        // update a document(profile picture)
        this.updateDocument = async (id, req, existingDocument) => {
            await this.checkFileSize(req.file);
            const result = await cloudinaryServices_1.default.uploadFile(req.file);
            const url = result.url;
            const { fileName, mimeType } = this.getFileNameAndMimeType(req.file);
            const publicId = (0, getPublicIdFromCloudinaryUrl_1.getPublicIdFromUrl)(existingDocument.url);
            await cloudinaryServices_1.default.deleteFile(publicId);
            await documentRepository_1.default.updateDocument(id, {
                fileName,
                url,
                mimeType,
            });
            const updatedDocument = await documentRepository_1.default.findOneById(id);
            return {
                updatedDocument: {
                    id: updatedDocument?.id,
                    url: updatedDocument?.url,
                    type: updatedDocument?.type
                }
            };
        };
        // delete multiple documents
        this.deleteDocuments = async (ids, forceDelete, existingDocuments) => {
            if (forceDelete == true) {
                const publicIds = existingDocuments.map(doc => (0, getPublicIdFromCloudinaryUrl_1.getPublicIdFromUrl)(doc.url));
                await Promise.all(publicIds.map(publicId => cloudinaryServices_1.default.deleteFile(publicId)));
                await documentRepository_1.default.deleteDocuments(ids);
            }
            else {
                const documentIdsToBeSoftDeleted = existingDocuments
                    .filter(doc => doc.status !== documentEnum_1.DocumentStatus.DELETED)
                    .map(doc => doc.id);
                if (documentIdsToBeSoftDeleted.length === 0) {
                    logger_1.logger.error("All documents are already soft deleted");
                    throw new appError_1.default(400, "All documents are already soft deleted");
                }
                await documentRepository_1.default.updateDocuments(documentIdsToBeSoftDeleted, { status: documentEnum_1.DocumentStatus.DELETED });
            }
        };
    }
}
exports.default = new DocumentService();
