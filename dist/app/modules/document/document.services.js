"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
const documentEnum_1 = require("./enums/documentEnum");
const documentRepository_1 = __importDefault(require("../../repository/documentRepository"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const getPublicIdFromCloudinaryUrl_1 = require("./utils/getPublicIdFromCloudinaryUrl");
const cloudinary_1 = require("cloudinary");
class DocumentService {
    constructor() {
        // upload a document
        this.createDocument = async (documentData) => {
            const { fileName, url, mimeType, type, remarks } = documentData;
            if (!fileName || !url || !mimeType || !type) {
                logger_1.logger.error("fileName, url and mimeType are required");
                throw new appError_1.default(400, "fileName, url and mimeType are required");
            }
            const exisitingDocument = await documentRepository_1.default.findOneByFileNameAndMimeType(fileName, mimeType);
            if (exisitingDocument) {
                logger_1.logger.error(`Document with this fileName and mimeType already exists`);
                throw new appError_1.default(400, `Document with this fileName and mimeType already exists`);
            }
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
        // update a document 
        this.updateDocument = async (id, updateData, res) => {
            const { fileName, url, mimeType } = updateData;
            if (!fileName || !url || !mimeType) {
                logger_1.logger.error("fileName, url and mimeType are required");
                throw new appError_1.default(400, "fileName, url and mimeType are required");
            }
            const exisitingDocument = await documentRepository_1.default.findOneById(id);
            if (!exisitingDocument) {
                logger_1.logger.error(`Document with this id does not exist`);
                return (0, sendResponse_1.default)(res, {
                    statusCode: 404,
                    success: false,
                    message: `Document with this id does not exist`
                });
            }
            const publicId = (0, getPublicIdFromCloudinaryUrl_1.getPublicIdFromUrl)(exisitingDocument.url);
            cloudinary_1.v2.uploader
                .destroy(publicId)
                .then(result => console.log(result));
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
        // delete a document
        this.deleteDocument = async (id, forceDelete, res) => {
            const exisitingDocument = await documentRepository_1.default.findOneById(id);
            if (!exisitingDocument) {
                logger_1.logger.error(`Document with this id does not exist`);
                return (0, sendResponse_1.default)(res, {
                    statusCode: 404,
                    success: false,
                    message: `Document with this id does not exist`
                });
            }
            if (forceDelete == true) {
                await documentRepository_1.default.deleteDocument(id);
            }
            else {
                await documentRepository_1.default.updateDocument(id, { status: documentEnum_1.DocumentStatus.DELETED });
            }
        };
    }
}
exports.default = new DocumentService();
