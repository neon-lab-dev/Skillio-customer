import {
  Entity,
  Column,
  Index
} from "typeorm";

import { OtpCodeStatus } from "../modules/verification/enums/verificationEnum";
import { verificationPurpose } from "../modules/verification/enums/verificationEnum";
import { BaseEntity } from "./baseEntity";


@Entity("verification")
@Index("IDX_PHONE",["phoneNumber"]) 
export class Verification extends BaseEntity{

    @Column()
    phoneNumber!: string;

    @Column()
    otpCode!: string;

    @Column()
    expirationDate!: Date;

    @Column({type: "enum", enum: OtpCodeStatus})
    otpCodeStatus!: OtpCodeStatus;

    @Column({type: "int", default: 0})
    attempts!: number;
}
