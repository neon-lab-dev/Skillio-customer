import { Entity , PrimaryColumn ,Column, Index } from "typeorm";

@Entity("conversationParticipant")
@Index("IDX_PARTICIPANT_CONVERSATION",["participantId", "conversationId"])
@Index("IDX_PARTICIPANT_JOINEDAT_DELETEDAT" , ["participantId" , "joinedAt" , "deletedAt"])
@Index("IDX_CONVERSATION" , ["conversationId"])
export class ConversationParticipant {

    @PrimaryColumn({type:"uuid"})
    conversationId!: string;

    @PrimaryColumn({type:"uuid"}) 
    participantId!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    joinedAt!: Date;

    @Column({ type: "timestamp",nullable:true })
    deletedAt?: Date;
}