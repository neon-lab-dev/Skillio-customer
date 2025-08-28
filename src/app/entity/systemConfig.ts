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

import { Medium } from "./notification";

@Entity("system_config")
export class SystemConfig{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar"})
    providerName!: string;

    @Column({type: "enum", enum: Medium})
    medium! : Medium

    @Column({type: "varchar"})
    apiKey?: string;

    @Column({type: "varchar", nullable: true})
    apiSecret?: string;

    @Column()
    twilioPhoneNumber?: string;

    @BeforeInsert()
    logInsert() {
      logger.info(`About to insert ProviderConfig with providerName: ${this.providerName}`);
    }
  
    @AfterInsert()
    logInserted() {
      logger.info(`Inserted ProviderConfig with id: ${this.id}`);
    }
  
    @BeforeUpdate()
    logUpdate() {
      logger.info(`About to update ProviderConfig with id: ${this.id}`);
    }
  
    @AfterUpdate()
    logUpdated() {
      logger.info(`Updated ProviderConfig with id: ${this.id}`);
    }
}