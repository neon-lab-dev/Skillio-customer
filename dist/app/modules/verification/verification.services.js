"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
const otpConfig_1 = require("./config/otpConfig");
const verificationEnum_1 = require("../../enums/verificationEnum");
const otp_1 = require("./utils/otp");
const verificationRepository_1 = __importDefault(require("../../repository/verificationRepository"));
const communicationService_1 = __importDefault(require("../notification/services/communicationService"));
const notificationEnum_1 = require("../../enums/notificationEnum");
const verificationAttemptsConfig_1 = require("./config/verificationAttemptsConfig");
class VerificationService {
    constructor() {
        // create a verification request
        this.verificationRequest = async (verificationData) => {
            const { phoneNumber, purpose } = verificationData;
            if (!phoneNumber || !purpose) {
                logger_1.logger.error("Phone number and purpose are required");
                throw new appError_1.default(400, "Phone number and purpose are required");
            }
            const otpCode = (0, otp_1.generateOtp)();
            const res = await communicationService_1.default.sendNotification({
                medium: notificationEnum_1.Medium.SMS,
                to: phoneNumber,
                bodyText: `Your OTP code is ${otpCode}. It is  valid for ${otpConfig_1.otpConfig.otpExpirationTime / 60000} minutes.`,
            });
            let verification;
            if (res.ok) {
                verification = await verificationRepository_1.default.createVerification({
                    phoneNumber: phoneNumber,
                    purpose: purpose,
                    otpCode,
                    expirationDate: new Date(Date.now() + otpConfig_1.otpConfig.otpExpirationTime),
                    otpCodeStatus: verificationEnum_1.OtpCodeStatus.SENT
                });
            }
            else {
                verification = await verificationRepository_1.default.createVerification({
                    phoneNumber: phoneNumber,
                    purpose: purpose,
                    otpCode: otpCode,
                    expirationDate: new Date(Date.now() + otpConfig_1.otpConfig.otpExpirationTime),
                    otpCodeStatus: verificationEnum_1.OtpCodeStatus.IN_PROGRESS
                });
            }
            if (!verification) {
                logger_1.logger.error("Failed to create verification");
                throw new appError_1.default(500, "Failed to create verification");
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
        this.reSendOtp = async (phoneNumber, verifciationId) => {
            if (!phoneNumber || !verifciationId) {
                logger_1.logger.error("Phone number and verification Id is required");
                throw new appError_1.default(400, "Phone number and verification id is required");
            }
            // Check for existing verification with otpCodeStatus IN_PROGRESS;
            const existingVerification = await verificationRepository_1.default.findOneByPhoneNumberIdAndInProgress(phoneNumber, verifciationId);
            if (!existingVerification) {
                logger_1.logger.error("No existing verification found to resend OTP");
                throw new appError_1.default(404, "No existing verification found to resend OTP");
            }
            if (existingVerification.attempts >= verificationAttemptsConfig_1.verificationAttemptsConfig.maxAttempts) {
                logger_1.logger.error("Maximum resend attempts reached");
                throw new appError_1.default(429, "Maximum resend attempts reached");
            }
            const res = await communicationService_1.default.sendNotification({
                medium: notificationEnum_1.Medium.SMS,
                to: phoneNumber,
                bodyText: `Your OTP code is ${existingVerification.otpCode}. It is  valid for ${otpConfig_1.otpConfig.otpExpirationTime / 60000} minutes.`,
            });
            if (res.ok) {
                await verificationRepository_1.default.update(existingVerification.id, {
                    otpCodeStatus: verificationEnum_1.OtpCodeStatus.SENT,
                    expirationDate: new Date(Date.now() + otpConfig_1.otpConfig.otpExpirationTime),
                    attempts: existingVerification.attempts + 1
                });
                return {
                    verification: {
                        id: existingVerification.id,
                        purpose: existingVerification.purpose
                    },
                    success: true
                };
            }
            else {
                return { verification: {
                        id: existingVerification.id,
                        purpose: existingVerification.purpose
                    },
                    success: false
                };
            }
        };
        // verify otp
        this.verifyOtp = async (verificationId, otpCode) => {
            if (!verificationId || !otpCode) {
                logger_1.logger.error("Verification ID and OTP code are required");
                throw new appError_1.default(400, "Verification ID and OTP code are required");
            }
            const existingVerification = await verificationRepository_1.default.findOneById(verificationId);
            if (!existingVerification) {
                logger_1.logger.error("Verification not found");
                throw new appError_1.default(404, "Verification not found");
            }
            const result = await (0, otp_1.verifyOtp)(otpCode, existingVerification.phoneNumber);
            if (!result.isValid) {
                logger_1.logger.error(`OTP verification failed: ${result.reason}`);
                throw new appError_1.default(400, `OTP verification failed: ${result.reason}`);
            }
            return { verificationId: existingVerification.id };
        };
    }
}
exports.default = new VerificationService();
