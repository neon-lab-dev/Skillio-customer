"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const express_1 = require("express");
const chat_controller_1 = __importDefault(require("./chat.controller"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const requireAuth_1 = require("../../middlewares/requireAuth");
const chat_validation_1 = require("./chat.validation");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = (0, express_1.Router)();
router.post("/", requireAuth_1.verifyToken, multer_1.default, (0, validateRequest_1.default)(chat_validation_1.sendMessageSchema), chat_controller_1.default.createMessage);
router.get("/", requireAuth_1.verifyToken, (0, validateRequest_1.default)(chat_validation_1.getMessagesSchema), chat_controller_1.default.getMesssages);
router.put("/:id", requireAuth_1.verifyToken, chat_controller_1.default.softDeleteMessage);
exports.chatRoutes = router;
