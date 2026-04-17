import {  OtpCodeStatus } from "../enums/verificationEnum";

export type TVerification = {
  phoneNumber: string;
  otpCode: string;
  expirationDate: Date;
  otpCodeStatus: OtpCodeStatus;
};

export type TVerificationConfig={
  maxAttempts: string;
}