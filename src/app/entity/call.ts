import { Entity , Column, PrimaryGeneratedColumn  } from "typeorm";
import { status } from "../modules/calling/enums/callEnum";
import { webRtcSessionDescription } from "../modules/calling/interface/call.interface";

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

    @Column({type:"json" , nullable:true})
    offer?:webRtcSessionDescription
    
    @Column({type:"json" , nullable:true})
    answer?:webRtcSessionDescription

    @Column({type: "timestamp" , default: () => "CURRENT_TIMESTAMP"})
    startedAt!: Date;

    @Column({type: "timestamp" , nullable:true})
    endedAt?: Date;
}
