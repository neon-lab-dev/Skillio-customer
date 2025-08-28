import crypto from "crypto";
import { AppDataSource } from "../db/dataSource";
import { otpConfig } from "../config/otpConfig";
import { Verification } from "../entity/verification";
import { OtpCodeStatus } from "../entity/verification";


// Generate a 6 digit OTP   
export const generateOTP = () => {
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

export const verifyOTP = async(otpCode: string , phoneNumber:string) => {

  const verification= AppDataSource.getRepository(Verification)

  const existingOTP=await verification.findOne({
    where: {
        phoneNumber: phoneNumber,
      },
  });

  if(!existingOTP) {
    return {
      isValid: false,   
      reason: "NOT_FOUND",  
    };
  }

  if(!otpConfig.testMode){
    const now = Date.now();
    const expiresAt = new Date(existingOTP.expirationDate).getTime();
  
    if (expiresAt < now) {
      await verification.update(
        { phoneNumber: phoneNumber },
        { otpCodeStatus: OtpCodeStatus.EXPIRED }
      )
      return {
        isValid: false,
        reason: "EXPIRED",
      };
    }
  }

  if (otpCode ==existingOTP.otpCode ) {
    await verification.update(
      {phoneNumber: phoneNumber },
      { otpCodeStatus: OtpCodeStatus.VERIFIED }
    )
    return {
      isValid: true,
    };
  }

  return {
    isValid: false,
    reason: "MISMATCH",
  };
};