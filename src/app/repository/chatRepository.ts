import { AppDataSource } from "../db/dataSource";
import { DeepPartial, Repository, LessThan } from "typeorm";
import { Message } from "../entity/message";

class ChatRepostory {
  private chatRepository: Repository<Message>;

  constructor() {
    this.chatRepository = AppDataSource.getRepository<Message>("Message");
  }

  // create a chat message
  createMessage = async (messageData: DeepPartial<Message>) => {
    const newMessage = this.chatRepository.create(messageData);
    return await this.chatRepository.save(newMessage);
  };

  // find Messages by  conversationId
  findMessagesByConversationId = async (
    conversationId: string,
    participantId: string,
    before: string,
    limit: string
  ) => {
    const messageLimit = parseInt(limit) || 30;
    const beforeDate = before ? new Date(before) : new Date();

    const messages = await this.chatRepository
      .createQueryBuilder("message")
      .leftJoin(
        "conversationParticipant",
        "cp",
        "cp.conversationId = message.conversationId"
      )
      .where("message.conversationId = :conversationId", { conversationId })
      .andWhere("cp.participantId = :participantId", { participantId })
      .andWhere("message.isDeleted = false")
      .andWhere("message.createdAt < :beforeDate", { beforeDate })
      .andWhere(
        `
      (cp.deletedAt IS NULL OR message.createdAt > cp.deletedAt)
      `
      )
      .orderBy("message.createdAt", "DESC")
      .take(messageLimit)
      .getMany();

    return messages;
  };

  // find message by Id
  findMessageById = async (id: string) => {
    return await this.chatRepository.findOne({
      where: { id },
    });
  };

  // update messageById
  updateMessageById = async (id: string, messageData: DeepPartial<Message>) => {
    return await this.chatRepository.update(id, messageData);
  };

  // update messages by conversationId
  updateMessagesByConversationId = async (
    conversationId: string,
    messageData: DeepPartial<Message>
  ) => {
    return await this.chatRepository.update({ conversationId }, messageData);
  };
}

export default new ChatRepostory();
