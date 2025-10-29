import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { content } from "../modules/chat/interface/chat.interface";
import { Status } from "../modules/chat/enums/chatEnum";

@Entity("message")
@Index("IDX_SENDER_RECIEVER" , ["senderId" , "recipientId"])
export class Message extends BaseEntity{

    @Column({type:"uuid"})
    senderId!: string;

    @Column({type:"uuid"})
    recipientId!: string;

    @Column({type:"json"})
    content!: content;

    @Column({type:"enum" , enum: Status , default: Status.SENT})
    status!: Status

    @Column({type:"timestamp" , nullable:true})
    readAt!: Date

    @Column({type: "boolean", default: false})
    isDeleted!: boolean;
}