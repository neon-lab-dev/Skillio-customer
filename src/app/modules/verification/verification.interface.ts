import { OtpCodeStatus , verificationPurpose } from "../../enums/verificationEnum";

export type TVerification = {
  phoneNumber: string;
  purpose: verificationPurpose;
  otpCode: string;
  expirationDate: Date;
  otpCodeStatus: OtpCodeStatus;
};