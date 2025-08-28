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

export enum OtpCodeStatus {
  SENT,
  VERIFIED,
  EXPIRED
}

export enum verificationPurpose {
  LOGIN,
  PHONE_VERIFICATION,
  EMAIL_VERIFICATION,
  SIGNUP
}

@Entity("verification")
export class Verification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    phoneNumber!: string;

    @Column()
    purpose!: string;

    @Column()
    otpCode!: string;

    @Column()
    expirationDate!: Date;

    @Column()
    otpCodeStatus!: OtpCodeStatus;

    @Column({ type: 'timestamp' })
    createdAt!: Date;

    @Column({type: "timestamp"})
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
