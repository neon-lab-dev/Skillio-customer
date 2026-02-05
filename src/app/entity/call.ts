import { Entity , Column, PrimaryGeneratedColumn  } from "typeorm";
import { status } from "../modules/calling/enums/callEnum";

@Entity("call")
export class Call{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    callerId!: string;

    @Column()
    recipientId!: string;

    @Column({type: "uuid"})
    conversationId!: string;

    @Column({type: "enum" , enum: status})
    callStatus!: status;

    @Column({type: "timestamp" , default: () => "CURRENT_TIMESTAMP"})
    startedAt!: Date;

    @Column({type: "timestamp" , nullable:true})
    endedAt?: Date;
}
