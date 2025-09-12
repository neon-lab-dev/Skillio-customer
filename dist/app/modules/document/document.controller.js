"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const document_services_1 = __importDefault(require("./document.services"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const document_dto_1 = require("./document.dto");
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
const cloudinary_1 = require("cloudinary");
class DocumentController {
    constructor() {
        // create document controller
        this.createDocument = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const documentData = new document_dto_1.DocumentDTO(req.body);
            let fileName;
            let url;
            let mimeType;
            if (req.file) {
                try {
                    const res = await cloudinary_1.v2.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
                        folder: "skilioDocument"
                    });
                    fileName = req.file.originalname;
                    url = res.url;
                    mimeType = req.file.mimetype;
                }
                catch (error) {
                    logger_1.logger.error("Error uploading file to Cloudinary:", error);
                    throw new appError_1.default(500, "Error uploading file to Cloudinary");
                }
            }
            const result = await document_services_1.default.createDocument({ ...documentData.toJSON(), fileName, url, mimeType });
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Document uploaded successfully",
                data: result
            });
        });
        // update document controller
        this.updateDocument = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { id } = req.params;
            let fileName;
            let url;
            let mimeType;
            if (req.file) {
                try {
                    const res = await cloudinary_1.v2.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
                        folder: "skilioDocument"
                    });
                    fileName = req.file.originalname;
                    url = res.url;
                    mimeType = req.file.mimetype;
                }
                catch (error) {
                    logger_1.logger.error("Error uploading file to Cloudinary:", error);
                    throw new appError_1.default(500, "Error uploading file to Cloudinary");
                }
            }
            const result = await document_services_1.default.updateDocument(id, { fileName, url, mimeType }, res);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Document updated successfully",
                data: result
            });
        });
        this.deleteDocument = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const { forceDelete } = req.body;
            await document_services_1.default.deleteDocument(id, forceDelete, res);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Document deleted successfully",
                data: null
            });
        });
    }
}
exports.default = new DocumentController();
