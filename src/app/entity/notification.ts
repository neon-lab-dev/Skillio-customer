import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
} from "typeorm";
import { logger } from "../utils/logger";

export enum Medium{
    EMAIL= "EMAIL" ,
    SMS = "SMS",
    PUSH_NOTIFICATION = "PUSH_NOTIFICATION"
}


export enum Status{
    IN_PROGRESS= "IN_PROGRESS",
    SENT="SENT",
    FAILED="FAILED"
}

export interface NotificationBody {
  otp?: string;
  emailSpecifics?: {
    subject?: string;
    htmlBody?: string;
    cc?: string[];
    bcc?: string[];
  };
}

export interface Attachment{
    name: string;
    contentId: string;
    mimeType?: string;
}

@Entity("notification")
export class Notification{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "enum", enum: Medium})
    medium!: Medium;

    @Column({type: "varchar", nullable: true})
    phone? : string;

    @Column({type: "varchar", nullable: true})
    email? : string;

    @Column({type: "varchar", nullable: true})
    deviceToken? : string;

    @Column({type: "jsonb"})
    bodyText?: NotificationBody;

    @Column({type: "jsonb", nullable: true})
    attachments?: Attachment[];

    @Column({type: "enum", enum: Status, default: Status.IN_PROGRESS})
    status!: Status;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    setUpdatedAt() {
        this.updatedAt = new Date();
    }

    @AfterInsert()
    logInsert() {
        logger.info(`Notification with ID ${this.id} has been inserted.`);
    }

    @AfterUpdate()
    logUpdate() {
        logger.info(`Notification with ID ${this.id} has been updated.`);
    }
}