import {
  Entity,
  Column
} from "typeorm";
import { BaseEntity } from "./baseEntity";

@Entity("system_config")
export class SystemConfig extends BaseEntity{

    @Column({type: "varchar"})
    configKey!: string;

    @Column({type: "simple-json", nullable: true})
    configValue?: any;
}