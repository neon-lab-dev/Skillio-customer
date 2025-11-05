import { AppDataSource } from "../db/dataSource";
import { DeepPartial, Repository } from "typeorm";
import { ConversationParticipant } from "../entity/conversationParticipant";

class ConversationParticipantRepository {
  private conversationParticipantRepository: Repository<ConversationParticipant>;

  constructor() {
    this.conversationParticipantRepository =
      AppDataSource.getRepository<ConversationParticipant>(
        "ConversationParticipant"
      );
  }

  // create a conversation participant
  createConversationParticipant = async (
    participantData: DeepPartial<ConversationParticipant>
  ) => {
    const newConversationParticipant =
      this.conversationParticipantRepository.create(participantData);
    return await this.conversationParticipantRepository.save(
      newConversationParticipant
    );
  };

  // update conversation participant by participantId and conversationId
  updateConversationParticipant = async (
    participantId: string,
    conversationId: string,
    updatedData: DeepPartial<ConversationParticipant>
  ) => {
    return await this.conversationParticipantRepository.update(
      {
        participantId,
        conversationId,
      },
      updatedData
    );
  };

  // get conversation participant by participantId and conversationId
  getConversationParticipant = async (
    participantId: string,
    conversationId: string
  ) => {
    return await this.conversationParticipantRepository.findOneBy({
      conversationId,
      participantId
    });
  };

  // get all converstaionIds of a participantId
  getAllConversationIdsByParticipantId = async (participantId: string) => {
    const results = await this.conversationParticipantRepository
      .createQueryBuilder("cp")
      .innerJoin("conversation", "conv", "conv.id = cp.conversationId")
      .select("cp.conversationId", "conversationId")
      .addSelect("conv.updatedAt", "updatedAt")
      .where("cp.participantId = :participantId", { participantId })
      .orderBy("conv.updatedAt", "DESC")
      .getRawMany();

    return results.map((result) => result.conversationId);
  };

  // get paginated conversations for a participantId
  getPaginatedConversationIdsByParticipantId = async (
    participantId: string,
    page: string,
    limit: string
  ) => {
    const conversationsPage = parseInt(page) || 1;
    const conversationsLimit = parseInt(limit) || 10;
    const skip = (conversationsPage - 1) * conversationsLimit;

    const results = await this.conversationParticipantRepository
      .createQueryBuilder("cp")
      .innerJoin("conversation", "conv", "conv.id = cp.conversationId")
      .select("cp.conversationId", "conversationId")
      .addSelect("conv.updatedAt", "updatedAt")
      .where("cp.participantId = :participantId", { participantId })
      .andWhere("(cp.deletedAt IS NULL OR cp.deletedAt < cp.joinedAt)")
      .orderBy("conv.updatedAt", "DESC")
      .limit(conversationsLimit)
      .offset(skip)
      .getRawMany();

      if(results.length!=0){
        return results.map((result) => result.conversationId);
      }else{
        return [];
      }
  };

  // get all participantIds of conversationIds excluding the user's profileId
  getAllParticipantIdsByConversationIds = async (
    conversationIds: string[],
    profileId: string
  ) => {

    const results = await this.conversationParticipantRepository
      .createQueryBuilder("conversationParticipant")
      .select("conversationParticipant.participantId", "participantId")
      .addSelect("conversationParticipant.conversationId", "conversationId")
      .where(
        "conversationParticipant.conversationId IN (:...conversationIds)",
        { conversationIds }
      )
      .andWhere('"conversationParticipant"."participantId" != :profileId', {
        profileId,
      })
      .orderBy(
        `array_position(ARRAY[:...conversationIds]::uuid[], conversationParticipant.conversationId)`
      )
      .setParameter("conversationIds", conversationIds)
      .getRawMany();

    return results.map((result) => result.participantId);
  };
}

export default new ConversationParticipantRepository();
