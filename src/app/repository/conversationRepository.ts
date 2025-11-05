import { AppDataSource } from "../db/dataSource";
import { Repository} from "typeorm";
import { Conversation } from "../entity/conversation";

class ConversationRepository {
  private conversationRepository: Repository<Conversation>;

  constructor() {
    this.conversationRepository =
      AppDataSource.getRepository<Conversation>("Conversation");
  }

  // create a conversation
  createConversation = async () => {
    const newConversation = this.conversationRepository.create();
    return await this.conversationRepository.save(newConversation);
  };

  // get conversation by id
  getConversationById = async (id: string) => {
    return await this.conversationRepository.findOne({ where: { id } });
  }

  // update conversation by id
  updateConversationById = async (id: string, conversationData: Partial<Conversation>) => {
    await this.conversationRepository.update({ id }, conversationData);
  }

  // get conversation by id
  getConversationByIdWithLatestMessage = async (id: string) => {
    const conversation = await this.conversationRepository
      .createQueryBuilder("conversation")
      .leftJoinAndSelect(
        "conversation.messages",
        "message",
        `message.id = (
        SELECT m.id 
        FROM message m 
        WHERE m."conversationId" = conversation.id 
        AND m."isDeleted" = false
        ORDER BY m."createdAt" DESC 
        LIMIT 1
      )`
      )
      .select(["conversation.id", "message.content" , "message.senderId"])
      .where("conversation.id = :id", { id })
      .getOne();

    return conversation?.messages[0];
  };
}

export default new ConversationRepository();
