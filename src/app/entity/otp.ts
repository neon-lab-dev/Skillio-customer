import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterInsert,
  AfterUpdate,
  ManyToOne,
} from "typeorm";
import { User } from "./user";

@Entity("otp")
export class OTP {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    otpCode!: string;

    @Column()
    expirationDate!: Date;

    @ManyToOne(()=> User , user=>user.opts)
    user?: User;

    @Column({ type: 'timestamp' })
    createdAt!: Date;

    @Column({type: "timestamp"})
    updatedAt!: Date;
}
