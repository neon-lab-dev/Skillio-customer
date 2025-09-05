import {
  Entity,
  Column
} from "typeorm";

import { OtpCodeStatus } from "../modules/verification/enums/verificationEnum";
import { verificationPurpose } from "../modules/verification/enums/verificationEnum";
import { BaseEntity } from "./baseEntity";


@Entity("verification")
export class Verification extends BaseEntity{

    @Column()
    phoneNumber!: string;

    @Column({type: "enum" , enum: verificationPurpose})
    purpose!: verificationPurpose;

    @Column()
    otpCode!: string;

    @Column()
    expirationDate!: Date;

    @Column({type: "enum", enum: OtpCodeStatus})
    otpCodeStatus!: OtpCodeStatus;

    @Column({type: "int", default: 0})
    attempts!: number;
}
