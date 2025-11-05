"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class ChatRepostory {
    constructor() {
        // create a chat message
        this.createMessage = async (messageData) => {
            const newMessage = this.chatRepository.create(messageData);
            return await this.chatRepository.save(newMessage);
        };
        // find Messages by  conversationId
        this.findMessagesByConversationId = async (conversationId, participantId, before, limit) => {
            const messageLimit = parseInt(limit) || 30;
            const beforeDate = before ? new Date(before) : new Date();
            const messages = await this.chatRepository
                .createQueryBuilder("message")
                .leftJoin("conversationParticipant", "cp", "cp.conversationId = message.conversationId")
                .where("message.conversationId = :conversationId", { conversationId })
                .andWhere("cp.participantId = :participantId", { participantId })
                .andWhere("message.isDeleted = false")
                .andWhere("message.createdAt < :beforeDate", { beforeDate })
                .andWhere(`
      (cp.deletedAt IS NULL OR message.createdAt > cp.deletedAt)
      `)
                .orderBy("message.createdAt", "DESC")
                .take(messageLimit)
                .getMany();
            return messages;
        };
        // find message by Id
        this.findMessageById = async (id) => {
            return await this.chatRepository.findOne({
                where: { id },
            });
        };
        // update messageById
        this.updateMessageById = async (id, messageData) => {
            return await this.chatRepository.update(id, messageData);
        };
        // update messages by conversationId
        this.updateMessagesByConversationId = async (conversationId, messageData) => {
            return await this.chatRepository.update({ conversationId }, messageData);
        };
        this.chatRepository = dataSource_1.AppDataSource.getRepository("Message");
    }
}
exports.default = new ChatRepostory();
