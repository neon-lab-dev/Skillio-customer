import {
  Entity,
  Column
} from "typeorm";
import { Medium , Status } from "../modules/notification/enums/notificationEnum";
import { BaseEntity } from "./baseEntity";


@Entity("notification")
export class Notification extends BaseEntity{

    @Column({type: "enum", enum: Medium})
    medium!: Medium;

    @Column({type: "varchar", nullable: true})
    to? : string;
  
    @Column({type: "text" , nullable: true})
    bodyText?: string;

    @Column("text",{array: true,  nullable: true})
    attachments?: string[];

    @Column({type: "enum", enum: Status, default: Status.IN_PROGRESS})
    status!: Status;
}