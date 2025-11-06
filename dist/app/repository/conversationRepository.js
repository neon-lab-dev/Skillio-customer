"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class ConversationRepository {
    constructor() {
        // create a conversation
        this.createConversation = async () => {
            const newConversation = this.conversationRepository.create();
            return await this.conversationRepository.save(newConversation);
        };
        // get conversation by id
        this.getConversationById = async (id) => {
            return await this.conversationRepository.findOne({ where: { id } });
        };
        // update conversation by id
        this.updateConversationById = async (id, conversationData) => {
            await this.conversationRepository.update({ id }, conversationData);
        };
        // get conversation by id
        this.getConversationByIdWithLatestMessage = async (id) => {
            const conversation = await this.conversationRepository
                .createQueryBuilder("conversation")
                .leftJoinAndSelect("conversation.messages", "message", `message.id = (
        SELECT m.id 
        FROM message m 
        WHERE m."conversationId" = conversation.id 
        AND m."isDeleted" = false
        ORDER BY m."createdAt" DESC 
        LIMIT 1
      )`)
                .select(["conversation.id", "message.content", "message.senderId"])
                .where("conversation.id = :id", { id })
                .getOne();
            return conversation?.messages[0];
        };
        this.conversationRepository =
            dataSource_1.AppDataSource.getRepository("Conversation");
    }
}
exports.default = new ConversationRepository();
