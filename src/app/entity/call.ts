import { Entity , Column, PrimaryGeneratedColumn  } from "typeorm";
import { status } from "../modules/calling/enums/callEnum";
import { AutoMap } from "@automapper/classes";

@Entity("call")
export class Call{
    @PrimaryGeneratedColumn("uuid")
    @AutoMap()
    id!: string;

    @Column()
    @AutoMap()
    callerId!: string;

    @Column()
    @AutoMap()
    recipientId!: string;

    @Column({type: "uuid"})
    @AutoMap()
    conversationId!: string;

    @Column({type: "enum" , enum: status})
    @AutoMap()
    callStatus!: status;

    @Column({type: "timestamp" , default: () => "CURRENT_TIMESTAMP"})
    @AutoMap()
    startedAt!: Date;

    @Column({type: "timestamp" , nullable:true})
    @AutoMap()
    endedAt?: Date;
}
