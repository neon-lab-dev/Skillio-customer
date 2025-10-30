"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatRepository_1 = __importDefault(require("../../repository/chatRepository"));
const chatSocket_1 = require("./utils/chatSocket");
const appError_1 = __importDefault(require("../../errors/appError"));
const logger_1 = __importDefault(require("../../utils/logger"));
const serviceLogging_1 = require("../../utils/serviceLogging");
const documentConfig_1 = require("../document/config/documentConfig");
const cloudinaryServices_1 = __importDefault(require("../document/services/cloudinaryServices"));
const chat_dto_1 = require("./chat.dto");
const chatEnum_1 = require("./enums/chatEnum");
class ChatService {
    constructor() {
        this.checkFileSize = async (file) => {
            const documentConfig = await (0, documentConfig_1.getDocumentConfig)();
            if (file.size > documentConfig.maxFileSize) {
                logger_1.default.error(`File size exceeds the maximum limit.`);
                throw new appError_1.default(400, `File size exceeds the maximum limit.`);
            }
            return;
        };
        // create/send message
        this.createMessage = (0, serviceLogging_1.serviceLogging)("ChatService", "createMessage", async (messageData, req) => {
            const { recipientId, content, fcmRegistrationToken } = messageData;
            const senderId = req.user.profileId;
            let url;
            if (req && req.file) {
                await this.checkFileSize(req.file);
                const res = await cloudinaryServices_1.default.uploadFile(req.file);
                url = res.url;
            }
            const newMessage = await chatRepository_1.default.createMessage({
                senderId,
                recipientId,
                content: {
                    ...content,
                    fileUrl: url
                },
                status: chatEnum_1.Status.SENT
            });
            await (0, chatSocket_1.sendMessage)(newMessage.id, senderId, recipientId, {
                content,
                fileUrl: url,
                timestamp: new Date()
            }, fcmRegistrationToken || "");
            const message = new chat_dto_1.GetChatDTO(newMessage).toJSON();
            return message;
        });
        // get messages between two users
        this.getMesssages = (0, serviceLogging_1.serviceLogging)("ChatService", "getMesssages", async (recipientId, before, limit, req) => {
            const senderId = req.user.profileId;
            const fetchedMessages = await chatRepository_1.default.findMessagesBySenderIdAndRecipientId(senderId, recipientId, before, limit);
            const unreadMessages = fetchedMessages.filter((message => message.recipientId === senderId && message.status === chatEnum_1.Status.SENT || message.status === chatEnum_1.Status.DELIVERED));
            if (unreadMessages.length > 0) {
                await Promise.all(unreadMessages.map(async (message) => {
                    await chatRepository_1.default.updateMessageById(message.id, {
                        status: chatEnum_1.Status.READ,
                        readAt: new Date()
                    });
                }));
            }
            const messages = await Promise.all(fetchedMessages.map(async (message) => {
                return new chat_dto_1.GetChatDTO(message).toJSON();
            }));
            return messages;
        });
        // soft delete message
        this.softDeleteMessage = (0, serviceLogging_1.serviceLogging)("ChatService", "softDeleteMessage", async (message) => {
            await chatRepository_1.default.updateMessageById(message.id, {
                isDeleted: true
            });
        });
    }
}
exports.default = new ChatService();
