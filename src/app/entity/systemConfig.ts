import {
  Entity,
  Column,
  Index
} from "typeorm";
import { BaseEntity } from "./baseEntity";

@Entity("system_config")
@Index("IDX_CONFIGKEY",["configKey"])
export class SystemConfig extends BaseEntity{

    @Column({type: "varchar"})
    configKey!: string;

    @Column({type: "simple-json"})
    configValue?: any;

}
