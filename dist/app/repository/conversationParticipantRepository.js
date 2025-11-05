"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../db/dataSource");
class ConversationParticipantRepository {
    constructor() {
        // create a conversation participant
        this.createConversationParticipant = async (participantData) => {
            const newConversationParticipant = this.conversationParticipantRepository.create(participantData);
            return await this.conversationParticipantRepository.save(newConversationParticipant);
        };
        // update conversation participant by participantId and conversationId
        this.updateConversationParticipant = async (participantId, conversationId, updatedData) => {
            return await this.conversationParticipantRepository.update({
                participantId,
                conversationId,
            }, updatedData);
        };
        // get conversation participant by participantId and conversationId
        this.getConversationParticipant = async (participantId, conversationId) => {
            return await this.conversationParticipantRepository.findOneBy({
                conversationId,
                participantId
            });
        };
        // get all converstaionIds of a participantId
        this.getAllConversationIdsByParticipantId = async (participantId) => {
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
        this.getPaginatedConversationIdsByParticipantId = async (participantId, page, limit) => {
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
            if (results.length != 0) {
                return results.map((result) => result.conversationId);
            }
            else {
                return [];
            }
        };
        // get all participantIds of conversationIds excluding the user's profileId
        this.getAllParticipantIdsByConversationIds = async (conversationIds, profileId) => {
            const results = await this.conversationParticipantRepository
                .createQueryBuilder("conversationParticipant")
                .select("conversationParticipant.participantId", "participantId")
                .addSelect("conversationParticipant.conversationId", "conversationId")
                .where("conversationParticipant.conversationId IN (:...conversationIds)", { conversationIds })
                .andWhere('"conversationParticipant"."participantId" != :profileId', {
                profileId,
            })
                .orderBy(`array_position(ARRAY[:...conversationIds]::uuid[], conversationParticipant.conversationId)`)
                .setParameter("conversationIds", conversationIds)
                .getRawMany();
            return results.map((result) => result.participantId);
        };
        this.conversationParticipantRepository =
            dataSource_1.AppDataSource.getRepository("ConversationParticipant");
    }
}
exports.default = new ConversationParticipantRepository();
