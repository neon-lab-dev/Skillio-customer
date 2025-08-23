import { OtpCodeStatus , verificationPurpose } from "../../entity/verification";

export type TVerification = {
  phoneNumber: string;
  purpose: verificationPurpose;
  otpCode: string;
  expirationDate: Date;
  otpCodeStatus: OtpCodeStatus;
};