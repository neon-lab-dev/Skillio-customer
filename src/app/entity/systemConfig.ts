import {
  Entity,
  Column
} from "typeorm";
import { Medium } from "../enums/notificationEnum";
import { BaseEntity } from "./baseEntity";

@Entity("system_config")
export class SystemConfig extends BaseEntity{

    @Column({type: "varchar"})
    providerName!: string;

    @Column({type: "enum", enum: Medium})
    medium! : Medium

    @Column({type: "varchar" , nullable: true})
    apiKey?: string;

    @Column({type: "varchar", nullable: true})
    apiSecret?: string;

    @Column({type: "varchar", nullable: true})
    twilioPhoneNumber?: string;
}