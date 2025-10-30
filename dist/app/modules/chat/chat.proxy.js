"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const proxyLogging_1 = require("../../utils/proxyLogging");
const chat_services_1 = __importDefault(require("./chat.services"));
const registrationRepository_1 = __importDefault(require("../../repository/registrationRepository"));
const logger_1 = __importDefault(require("../../utils/logger"));
const appError_1 = __importDefault(require("../../errors/appError"));
const chatRepository_1 = __importDefault(require("../../repository/chatRepository"));
class ChatProxy {
    constructor() {
        this.checkIfProfileExists = async (profileId, type) => {
            const existingProfile = await registrationRepository_1.default.findProfileById(profileId);
            if (!existingProfile) {
                logger_1.default.error(`${type} Profile with this Id doesnot exist`);
                throw new appError_1.default(404, `${type} Profile doesnot exist`);
            }
        };
        // create/send message
        this.createMessage = (0, proxyLogging_1.proxyLogging)("ChatProxy", "createMessage", async (messageData, req) => {
            const { recipientId } = messageData;
            await this.checkIfProfileExists(recipientId, "Recipient");
            return await chat_services_1.default.createMessage(messageData, req);
        });
        // get messages between two users
        this.getMesssages = (0, proxyLogging_1.proxyLogging)("ChatProxy", "getMesssages", async (recipientId, before, limit, req) => {
            await this.checkIfProfileExists(recipientId, "Recipient");
            return await chat_services_1.default.getMesssages(recipientId, before, limit, req);
        });
        // soft delete message
        this.softDeleteMessage = (0, proxyLogging_1.proxyLogging)("ChatProxy", "softDeleteMessage", async (id, req) => {
            const message = await chatRepository_1.default.findMessageById(id);
            if (!message) {
                logger_1.default.error("Message not found");
                throw new appError_1.default(404, "Message not found");
            }
            const profileId = req.user.profileId;
            if (message.senderId !== profileId) {
                logger_1.default.error("unauthorized access");
                throw new appError_1.default(403, "unauthorized access");
            }
            if (message.isDeleted === true) {
                logger_1.default.error("Message already deleted");
                throw new appError_1.default(400, "Message already deleted");
            }
            return await chat_services_1.default.softDeleteMessage(message);
        });
    }
}
exports.default = new ChatProxy();
