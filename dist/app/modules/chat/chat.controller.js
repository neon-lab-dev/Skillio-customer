"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_proxy_1 = __importDefault(require("./chat.proxy"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const chat_dto_1 = require("./chat.dto");
const controllerLogging_1 = require("../../utils/controllerLogging");
class ChatController {
    constructor() {
        // create/send message
        this.createMessage = (0, controllerLogging_1.controllerLogging)("ChatController.createMessage", (0, catchAsyncError_1.default)(async (req, res) => {
            const messageData = new chat_dto_1.ChaDTO(req.body);
            const result = await chat_proxy_1.default.createMessage(messageData.toJSON(), req);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Message sent successfully",
                data: result
            });
        }));
        // get messages between two users
        this.getMesssages = (0, controllerLogging_1.controllerLogging)("ChatController.getMesssages", (0, catchAsyncError_1.default)(async (req, res) => {
            const conversationId = req.query.conversationId;
            const limit = req.query.limit;
            const before = req.query.before;
            const result = await chat_proxy_1.default.getMesssages(conversationId, before, limit, req);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Messages fetched successfully",
                data: result
            });
        }));
        //  get conversations
        this.getConversations = (0, controllerLogging_1.controllerLogging)("ChatController.getConversations", (0, catchAsyncError_1.default)(async (req, res) => {
            const page = req.query.page;
            const limit = req.query.limit;
            const result = await chat_proxy_1.default.getConversations(page, limit, req);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Conversations fetched successfully",
                data: result
            });
        }));
        //  soft delete conversation
        this.softDeleteConversation = (0, controllerLogging_1.controllerLogging)("ChatController.softDeleteConversation", (0, catchAsyncError_1.default)(async (req, res) => {
            const { id } = req.params;
            await chat_proxy_1.default.softDeleteConversation(id, req);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Conversation deleted successfully",
            });
        }));
        // soft delete message
        this.softDeleteMessage = (0, controllerLogging_1.controllerLogging)("ChatController.softDeleteMessage", (0, catchAsyncError_1.default)(async (req, res) => {
            const { id } = req.params;
            await chat_proxy_1.default.softDeleteMessage(id, req);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Message deleted successfully",
            });
        }));
    }
}
exports.default = new ChatController();
