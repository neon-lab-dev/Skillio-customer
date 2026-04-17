import crypto from "crypto";
import verificationRepository from "../../../repository/verificationRepository";
import { OtpCodeStatus, verificationPurpose } from "../enums/verificationEnum";
import { getOtpConfig } from "../config/otpConfig";

export const generateOtp = async () => {
  const otpConfig = await getOtpConfig();

  if (!otpConfig) {
    throw new Error("OTP configuration not found");
  }

  const otpLength = otpConfig.otpLength;

  if (otpConfig.testMode) {
    return "0000";
  }

  const otp = (crypto.randomInt(0, Math.pow(10, otpLength)) + Math.pow(10 , otpLength))
    .toString()
    .substring(1);

  if (otp.length < otpLength) {
    return (
      Array(otpLength - otp.length)
        .fill(0)
        .join("") + otp
    );
  }
  return otp.substring(0, otpLength);
};

export const verifyOtp = async (otpCode: string, phoneNumber: string , verifciationId: string) => {
  const existingOtp = await verificationRepository.findOneByPhoneNUmberAndId(
    phoneNumber,
      verifciationId
  );

  if (!existingOtp) {
    return {
      isValid: false,
      reason: "NOT_FOUND",
    };
  }

  const otpConfig = await getOtpConfig();

  if (!otpConfig) {
    throw new Error("OTP configuration not found");
  }

    const now = Date.now();
    const expiresAt = new Date(existingOtp.expirationDate).getTime();

    if (expiresAt < now) {
      await verificationRepository.update(existingOtp.id, {
        otpCodeStatus: OtpCodeStatus.EXPIRED,
      });

      return {
        isValid: false,
        reason: "EXPIRED",
      };
    }

  if (otpCode == existingOtp.otpCode) {
    await verificationRepository.update(existingOtp.id, {
      otpCodeStatus: OtpCodeStatus.VERIFIED,
    });

    return {
      isValid: true,
    };
  }

  return {
    isValid: false,
    reason: "MISMATCH",
  };
};


export const checkIfExpired= async(phoneNumber: string )=>{
  const existingVerification= await verificationRepository.findOneByPhoneNumber(phoneNumber);
  if(!existingVerification){
    return{
      expired: true
    }
  }
  const now = Date.now();
  const expiresAt = new Date(existingVerification.expirationDate).getTime();

  if (expiresAt < now) {
      await verificationRepository.update(existingVerification.id, {
        otpCodeStatus: OtpCodeStatus.EXPIRED,
      });

      return {
        expired: true
      };
  }
  
  return{
    expired: false
  }
}