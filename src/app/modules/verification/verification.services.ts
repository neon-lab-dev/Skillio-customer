import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { TVerification } from "./verification.interface";
import { otpConfig } from "./config/otpConfig";
import { OtpCodeStatus } from "../../enums/verificationEnum";
import { generateOtp, verifyOtp } from "./utils/otp";
import verificationRepository from "../../repository/verificationRepository";
import communicationService from "../notification/services/communicationService";
import { Medium } from "../../enums/notificationEnum";
import { verificationAttemptsConfig } from "./config/verificationAttemptsConfig";

class VerificationService {
  // create a verification request
  verificationRequest = async (verificationData: Partial<TVerification>) => {
    const { phoneNumber, purpose } = verificationData;

    if (!phoneNumber || !purpose) {
      logger.error("Phone number and purpose are required");
      throw new AppError(400, "Phone number and purpose are required");
    }

    const otpCode = generateOtp();

    const res = await communicationService.sendNotification({
      medium: Medium.SMS,
      to: phoneNumber,
      bodyText: `Your OTP code is ${otpCode}. It is  valid for ${
        otpConfig.otpExpirationTime / 60000
      } minutes.`,
    });

    let verification;

    if (res.ok) {
      verification = await verificationRepository.createVerification({
        phoneNumber: phoneNumber,
        purpose: purpose,
        otpCode,
        expirationDate: new Date(Date.now() + otpConfig.otpExpirationTime),
        otpCodeStatus: OtpCodeStatus.SENT
      });
    } else {
      verification = await verificationRepository.createVerification({
        phoneNumber: phoneNumber,
        purpose: purpose,
        otpCode: otpCode,
        expirationDate: new Date(Date.now() + otpConfig.otpExpirationTime),
        otpCodeStatus: OtpCodeStatus.IN_PROGRESS
      });
    }

    if (!verification) {
      logger.error("Failed to create verification");
      throw new AppError(500, "Failed to create verification");
    }

    return {
      verification: {
        id: verification.id,
        purpose: verification.purpose,
        notificationSent: res.ok,
      },
    };
  };


  // resend otp
  reSendOtp=async(phoneNumber: string , verifciationId: string)=>{
    if(!phoneNumber || !verifciationId){
      logger.error("Phone number and verification Id is required");
      throw new AppError(400, "Phone number and verification id is required");
    }

    // Check for existing verification with otpCodeStatus IN_PROGRESS;
    const existingVerification= await verificationRepository.findOneByPhoneNumberIdAndInProgress(phoneNumber , verifciationId)

    if(!existingVerification){
        logger.error("No existing verification found to resend OTP");
        throw new AppError(404, "No existing verification found to resend OTP");
    }

    if(existingVerification.attempts >= verificationAttemptsConfig.maxAttempts){
        logger.error("Maximum resend attempts reached");
        throw new AppError(429, "Maximum resend attempts reached");
    }

    const res= await communicationService.sendNotification({
        medium: Medium.SMS,
        to: phoneNumber,
        bodyText: `Your OTP code is ${existingVerification.otpCode}. It is  valid for ${
            otpConfig.otpExpirationTime / 60000
          } minutes.`,
    });

    if(res.ok){
        await verificationRepository.update(existingVerification.id, {
            otpCodeStatus: OtpCodeStatus.SENT,
            expirationDate: new Date(Date.now() + otpConfig.otpExpirationTime),
            attempts: existingVerification.attempts + 1
        });

        return{
            verification:{
                id: existingVerification.id,
                purpose: existingVerification.purpose
            },
            success: true
        }
    }else{
        return{verification:{
            id: existingVerification.id,
            purpose: existingVerification.purpose
        },
        success: false 
        }
    }
  }

  // verify otp
  verifyOtp = async (verificationId: string, otpCode: string) => {
    if (!verificationId || !otpCode) {
      logger.error("Verification ID and OTP code are required");
      throw new AppError(400, "Verification ID and OTP code are required");
    }

    const existingVerification = await verificationRepository.findOneById(
      verificationId
    );

    if (!existingVerification) {
      logger.error("Verification not found");
      throw new AppError(404, "Verification not found");
    }

    const result = await verifyOtp(otpCode, existingVerification.phoneNumber);

    if (!result.isValid) {
      logger.error(`OTP verification failed: ${result.reason}`);
      throw new AppError(400, `OTP verification failed: ${result.reason}`);
    }

    return { verificationId: existingVerification.id };
  };
}

export default new VerificationService();
