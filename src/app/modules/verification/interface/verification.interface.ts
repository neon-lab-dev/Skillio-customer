import { verificationPurpose, OtpCodeStatus } from "../../../enums/verificationEnum";

export type TVerification = {
  phoneNumber: string;
  purpose: verificationPurpose;
  otpCode: string;
  expirationDate: Date;
  otpCodeStatus: OtpCodeStatus;
};

export type TVerificationConfig={
  maxAttempts: string;
}