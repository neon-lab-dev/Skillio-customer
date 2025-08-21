import crypto from "crypto";
import { OTP } from "../entity/otp";
import { AppDataSource } from "../db/dataSource";

// Generate a 6 digit OTP
export const generateOTP = () => {
  const otp = (crypto.randomInt(0, 1000000) + 1000000).toString().substring(1);

  if (otp.length === 6) {
    return otp;
  }
  if (otp.length < 6) {
    //add 0 to the start of the otp
    return (
      Array(6 - otp.length)
        .fill(0)
        .join("") + otp
    );
  }
  return otp.substring(0, 6);
};

export const validateOTP = async(otpCode: string , otpExpirationDate:Date , userId:string) => {
  const now = Date.now();
  const expiresAt = new Date(otpExpirationDate).getTime();

  if (expiresAt < now) {
    return {
      isValid: false,
      reason: "EXPIRED",
    };
  }

  const existingOTP=await AppDataSource.getRepository(OTP).findOne({
    where: {
        user: { id: userId },
        },
  });

  if(!existingOTP) {
    return {
      isValid: false,
      reason: "NOT_FOUND",
    };
  }

  if (otpCode ==existingOTP.otpCode ) {
    return {
      isValid: true,
    };
  }

  return {
    isValid: false,
    reason: "MISMATCH",
  };
};