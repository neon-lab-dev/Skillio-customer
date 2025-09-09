import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { OtpCodeStatus } from "./enums/verificationEnum";
import { TVerification } from "./interface/verification.interface";
import { generateOtp, verifyOtp } from "./utils/otp";
import verificationRepository from "../../repository/verificationRepository";
import { Medium } from "../notification/enums/notificationEnum";
import notificationServices from "../notification/services/notification.services";
import { getOtpConfig } from "./config/otpConfig";
import { getVerificationConfig } from "./config/verificationAttemptsConfig";
import sendResponse from "../../middlewares/sendResponse";
import { Response } from "express";

class VerificationService {
  // create a verification request
  verificationRequest = async (verificationData: Partial<TVerification>) => {
    const { phoneNumber, purpose } = verificationData;

    if (!phoneNumber || !purpose) {
      logger.error("Phone number and purpose are required");
      throw new AppError(400, "Phone number and purpose are required");
    }

    const exisitingNonTerminatingVerification =
      await verificationRepository.findOneByPhoneNumberPurposeAndNonTerminating(
        phoneNumber,
        purpose
      );

    if (exisitingNonTerminatingVerification) {
      logger.error(
        "A verification for this phone number and purpose already exists and in progress or sent state"
      );
      throw new AppError(
        409,
        "A verification for this phone number and purpose already exists and in progress or sent state"
      );
    }

    const otpCode = await generateOtp();

    const otpConfig = await getOtpConfig();

    const verification= await verificationRepository.createVerification({
      phoneNumber: phoneNumber,
      purpose: purpose,
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
        purpose: verification.purpose,
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
          purpose: existingVerification.purpose,
        },
        success: true,
      };
    } else {
      return {
        verification: {
          id: existingVerification.id,
          purpose: existingVerification.purpose,
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

    if (existingVerification.otpCodeStatus === OtpCodeStatus.VERIFIED) {
      return sendResponse(res, {
        statusCode: 409, 
        success: false,
        message: "OTP has already been verified",
        data: { verificationId: existingVerification.id },
      });
    }

    const result = await verifyOtp( otpCode, existingVerification.phoneNumber, existingVerification.id);

    if (!result.isValid) {
      logger.error(`OTP verification failed: ${result.reason}`);
      throw new AppError(400, `OTP verification failed: ${result.reason}`);
    }

    existingVerification = await verificationRepository.findOneById(
      verificationId
    );

    return { verificationId: existingVerification?.id };
  };
}

export default new VerificationService();
