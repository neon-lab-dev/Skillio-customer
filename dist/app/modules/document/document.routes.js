"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRoutes = void 0;
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const document_controller_1 = __importDefault(require("./document.controller"));
const document_validation_1 = require("./document.validation");
const document_validation_2 = require("./document.validation");
const express_1 = require("express");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = (0, express_1.Router)();
router.post("/", multer_1.default, (0, validateRequest_1.default)(document_validation_1.documentRequestSchema), document_controller_1.default.createDocument);
router.put("/:id", multer_1.default, (0, validateRequest_1.default)(document_validation_2.updateDocumentSchema), document_controller_1.default.updateDocument);
router.delete("/:id", (0, validateRequest_1.default)(document_validation_1.deleteDocumentSchema), document_controller_1.default.deleteDocument);
exports.documentRoutes = router;
