import crypto from "crypto";
import verificationRepository from "../../../repository/verificationRepository";
import { otpConfig } from "../config/otpConfig";
import { OtpCodeStatus } from "../../../enums/verificationEnum";


// Generate a 6 digit OTP   
export const generateOtp = () => {
  if(otpConfig.testMode) {
    return "000000";
  }

  const otp = (crypto.randomInt(0, Math.pow(10,otpConfig.otpLength)) + 1000000).toString().substring(1);

  // Ensure the OTP is always 6 digits
  if (otp.length < otpConfig.otpLength) {
    return (
      Array(6 - otp.length)
        .fill(0)
        .join("") + otp
    );
  }
  return otp.substring(0, otpConfig.otpLength);
};

export const verifyOtp = async(otpCode: string , phoneNumber:string) => {

  const existingOtp = await verificationRepository.findOneByPhoneNUmber(phoneNumber);

  if(!existingOtp) {
    return {
      isValid: false,   
      reason: "NOT_FOUND",  
    };
  }

  if(!otpConfig.testMode){
    const now = Date.now();
    const expiresAt = new Date(existingOtp.expirationDate).getTime();
  
    if (expiresAt < now) {
      await verificationRepository.update(existingOtp.id, { otpCodeStatus: OtpCodeStatus.EXPIRED });

      return {
        isValid: false,
        reason: "EXPIRED",
      };
    }
  }

  if (otpCode ==existingOtp.otpCode ) {
    await verificationRepository.update(existingOtp.id, { otpCodeStatus: OtpCodeStatus.VERIFIED });
    return {
      isValid: true,
    };
  }

  return {
    isValid: false,
    reason: "MISMATCH",
  };
};