import {
  Entity,
  Column
} from "typeorm";
import { BaseEntity } from "./baseEntity";


@Entity("user")
export class User extends BaseEntity{

    @Column({unique: true , nullable: true})
    phoneNumber?: string;

    @Column({ unique: true ,nullable: true})
    email?: string;

    @Column({type: "varchar"})
    pin!: string;

    @Column({type:"boolean" ,default: false})
    isVerified!: boolean;

}
