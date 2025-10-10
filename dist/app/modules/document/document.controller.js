"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const document_dto_1 = require("./document.dto");
const document_proxy_1 = __importDefault(require("./document.proxy"));
class DocumentController {
    constructor() {
        // create document controller
        this.createDocument = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const documentData = new document_dto_1.DocumentDTO(req.body);
            const result = await document_proxy_1.default.createDocument({ ...documentData.toJSON() }, req);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Document uploaded successfully",
                data: result
            });
        });
        // get document controller
        this.getDocument = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const result = await document_proxy_1.default.getDocument(id);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Document fetched successfully",
                data: result
            });
        });
        // update document(profile picture) controller
        this.updateDocument = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { id } = req.body;
            const result = await document_proxy_1.default.updateDocument(id, req);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Document updated successfully",
                data: result
            });
        });
        // delete multiple documents
        this.deleteDocuments = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { ids, forceDelete } = req.body;
            await document_proxy_1.default.deleteDocuments(ids, forceDelete);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Documents deleted successfully",
            });
        });
    }
}
exports.default = new DocumentController();
