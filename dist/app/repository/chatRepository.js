"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
const typeorm_1 = require("typeorm");
class ChatRepostory {
    constructor() {
        // create a chat message
        this.createMessage = async (messageData) => {
            const newMessage = this.chatRepository.create(messageData);
            return await this.chatRepository.save(newMessage);
        };
        // find messages by senderId and recipientId
        this.findMessagesBySenderIdAndRecipientId = async (senderId, recipientId, before, limit) => {
            const messageLimit = parseInt(limit) || 30;
            return await this.chatRepository.find({
                where: [
                    {
                        senderId,
                        recipientId,
                        ...(before ? { createdAt: (0, typeorm_1.LessThan)(before) } : {}),
                    },
                    {
                        senderId: recipientId,
                        recipientId: senderId,
                        ...(before ? { createdAt: (0, typeorm_1.LessThan)(before) } : {}),
                    },
                ],
                order: {
                    createdAt: "DESC",
                },
                take: messageLimit,
            });
        };
        // update messageById
        this.updateMessageById = async (id, messageData) => {
            return await this.chatRepository.update(id, messageData);
        };
        this.chatRepository = dataSource_1.AppDataSource.getRepository("Message");
    }
}
exports.default = new ChatRepostory();
