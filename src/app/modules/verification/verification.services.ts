import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { OtpCodeStatus } from "./enums/verificationEnum";
import { TVerification } from "./interface/verification.interface";
import { checkIfExpired, generateOtp, verifyOtp } from "./utils/otp";
import verificationRepository from "../../repository/verificationRepository";
import { Medium } from "../notification/enums/notificationEnum";
import notificationServices from "../notification/services/notification.services";
import { getOtpConfig } from "./config/otpConfig";
import { getVerificationConfig } from "./config/verificationAttemptsConfig";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";
import registrationServices from "../registration/registration.services";
import { AppValidationError, JwtService } from "@neon-lab-dev/platform";
import { getJwtConfig } from "../registration/config/jwtConfig";
import { contactType } from "../registration/enums/registrationEnum";

class VerificationService {

  // create a verification request
  verificationRequest = async (verificationData: Partial<TVerification>) => {
    const { phoneNumber } = verificationData;

    if (!phoneNumber) {
      logger.error("Phone number is required");
      throw new AppError(400, "Phone number is required");
    }

    const profile= await registrationServices.findProfileByCredential(phoneNumber);

    const existingVerification= await verificationRepository.findOneByPhoneNumber(phoneNumber);
    
    if(profile){
      if(profile.pin){
        return{
          isPinSet: true,
          message: "welcome back , please login with pin"
        }
      }else{
        return{
          isPinSet: false,
          message: "welcome back , please login otp",
          verificationId: existingVerification?.id
        }
      }
    }
    
    const verificationExpiry= await checkIfExpired(phoneNumber);

    const exisitingNonTerminatingVerification =
      await verificationRepository.findOneByPhoneNumberAndNonTerminating(
        phoneNumber,
      );

    if (exisitingNonTerminatingVerification && !verificationExpiry.expired && exisitingNonTerminatingVerification.otpCodeStatus===OtpCodeStatus.VERIFIED) {
      logger.error(
        "A verification for this phone number already exists."
      );
      throw new AppError(
        409,
        "A verification for this phone number already exists."
      );
    }

    const otpCode = await generateOtp();

    const otpConfig = await getOtpConfig();

    const verification= await verificationRepository.createVerification({
      phoneNumber: phoneNumber,
      otpCode,
      expirationDate: new Date(Date.now() + otpConfig.otpExpirationTime),
      otpCodeStatus: OtpCodeStatus.IN_PROGRESS,
    });

    const res = await notificationServices.createNotification({
      medium: Medium.SMS,
      to: phoneNumber,
      bodyText: otpCode,
    });

     await verificationRepository.update(verification.id,{
      otpCodeStatus: OtpCodeStatus.SENT
     });

    return {
      verification: {
        id: verification.id,
        notificationSent: res.notification.res.ok,
      },
    };
  };

  // resend otp
  reSendOtp = async (phoneNumber: string, verifciationId: string) => {
    if (!phoneNumber || !verifciationId) {
      logger.error("Phone number and verification Id is required");
      throw new AppError(400, "Phone number and verification id is required");
    }

    // Check for existing verification with otpCodeStatus IN_PROGRESS or sent;
    const existingVerification =
      await verificationRepository.findOneByIdAndInProgressOrSent(
        verifciationId
    );

    if (!existingVerification) {
      logger.error("No existing verification found to resend OTP");
      throw new AppError(404, "No existing verification found to resend OTP");
    }

    const verificationAttemptsConfig = await getVerificationConfig();

    if (existingVerification.attempts >= parseInt(verificationAttemptsConfig?.maxAttempts)
    ) {
      logger.error("Maximum resend attempts reached");
      throw new AppError(429, "Maximum resend attempts reached");
    }

    const res = await notificationServices.createNotification({
      medium: Medium.SMS,
      to: phoneNumber,
      bodyText: existingVerification.otpCode,
    });

    if (res.notification.res.ok) {
      await verificationRepository.update(existingVerification.id, {
        otpCodeStatus: OtpCodeStatus.SENT,
        attempts: existingVerification.attempts + 1,
      });

      return {
        verification: {
          id: existingVerification.id,
        },
        success: true,
      };
    } else {
      return {
        verification: {
          id: existingVerification.id,
        },
        success: false,
      };
    }
  };

  // verify otp
  verifyOtp = async (verificationId: string, otpCode: string, res: Response
  ) => {
    if (!verificationId || !otpCode) {
      logger.error("Verification ID and OTP code are required");
      throw new AppError(400, "Verification ID and OTP code are required");
    }

    let existingVerification = await verificationRepository.findOneById(
      verificationId
    );

    if (!existingVerification) {
      logger.error("Verification not found");
      throw new AppError(404, "Verification not found");
    }

    // if (existingVerification.otpCodeStatus === OtpCodeStatus.VERIFIED) {
    //   return sendResponse(res, {
    //     statusCode: 409, 
    //     success: false,
    //     message: "OTP has already been verified",
    //     data: { verificationId: existingVerification.id },
    //   });
    // }

    const result = await verifyOtp( otpCode, existingVerification.phoneNumber, existingVerification.id);

    if (!result.isValid) {
      logger.error(`OTP verification failed: ${result.reason}`);
      throw new AppError(400, `OTP verification failed: ${result.reason}`);
    }

    existingVerification = await verificationRepository.findOneById(
      verificationId
    );
    
    let accessToken= null;
    let refreshToken=null;

    let profile= await registrationServices.findProfileByCredential(existingVerification?.phoneNumber!);

    if(!profile){
      profile= await registrationServices.createProfile([{
        type:contactType.PHONE,
        value: existingVerification?.phoneNumber as string,
        isVerified: true,
        verificationId: existingVerification?.id as string
      }])
    }
 
    const jwtPayload={
        profileId: profile.id,
        role: profile.role
    }

    const jwtConfig= await getJwtConfig();

    accessToken=JwtService.createToken(
        jwtPayload,
        jwtConfig.JWT_ACCESS_SECRET,
        jwtConfig.JWT_ACCESS_EXPIRES_IN
    )

    refreshToken=JwtService.createToken(
        jwtPayload,
        jwtConfig.JWT_REFRESH_SECRET,
        jwtConfig.JWT_REFRESH_EXPIRES_IN
    )

    return { 
      verificationId: existingVerification?.id,
      profileId: profile.id,
      isOnboarded: profile.isOnboarded,
      isCreator: profile.isCreator,
      portfolioId: profile.portfolio?.id,
      accessToken,
      refreshToken
    };
  };
}

export default new VerificationService();
