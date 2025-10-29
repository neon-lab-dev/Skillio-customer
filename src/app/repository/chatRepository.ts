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

  // find messages by senderId and recipientId
  findMessagesBySenderIdAndRecipientId = async (
    senderId: string,
    recipientId: string,
    before: Date,
    limit: string
  ) => {
    const messageLimit = parseInt(limit) || 30;

    return await this.chatRepository.find({
      where: [
        {
          senderId,
          recipientId,
          ...(before ? { createdAt: LessThan(before) } : {}),
        },
        {
          senderId: recipientId,
          recipientId: senderId,
          ...(before ? { createdAt: LessThan(before) } : {}),
        },
      ],
      order: {
        createdAt: "DESC",
      },
      take: messageLimit,
    });
  };

  // update messageById
  updateMessageById = async (id: string, messageData: DeepPartial<Message>) => {
    return await this.chatRepository.update(id, messageData);
  };
}

export default new ChatRepostory();
