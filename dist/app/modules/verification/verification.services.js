"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataSource_1 = require("../../db/dataSource");
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
const otpConfig_1 = require("../../config/otpConfig");
const otp_1 = require("../../utils/otp");
const verification_1 = require("../../entity/verification");
class VerificationService {
    constructor() {
        this.verificationRequest = async (verificationData, res) => {
            const { phoneNumber, purpose } = verificationData;
            if (!phoneNumber || !purpose) {
                logger_1.logger.error("Phone number and purpose are required");
                throw new appError_1.default(400, "Phone number and purpose are required");
            }
            const existingVerification = await this.verificationRepository.findOne({
                where: {
                    phoneNumber: phoneNumber,
                    purpose: purpose
                }
            });
            if (existingVerification) {
                logger_1.logger.info("Verification request already exists");
                throw new appError_1.default(409, "Verification request already exists");
            }
            const otpCode = (0, otp_1.generateOTP)();
            const newVerification = this.verificationRepository.create({
                phoneNumber: phoneNumber,
                purpose: purpose,
                otpCode,
                expirationDate: new Date(Date.now() + otpConfig_1.otpConfig.otpExpirationTime),
                otpCodeStatus: verification_1.OtpCodeStatus.SENT
            });
            if (!newVerification) {
                logger_1.logger.error("Failed to create verification");
                throw new appError_1.default(500, "Failed to create verification");
            }
            const verification = await this.verificationRepository.save(newVerification);
            if (!verification) {
                logger_1.logger.error("Failed to save verification");
                throw new appError_1.default(500, "Failed to save verification");
            }
            return { verification: {
                    id: verification.id,
                    purpose: verification.purpose,
                } };
        };
        this.verifyOtp = async (verificationId, otpCode) => {
            if (!verificationId || !otpCode) {
                logger_1.logger.error("Verification ID and OTP code are required");
                throw new appError_1.default(400, "Verification ID and OTP code are required");
            }
            const existingVerification = await this.verificationRepository.findOne({
                where: {
                    id: verificationId
                }
            });
            if (!existingVerification) {
                logger_1.logger.error("Verification not found");
                throw new appError_1.default(404, "Verification not found");
            }
            const result = await (0, otp_1.verifyOTP)(otpCode, existingVerification.phoneNumber);
            if (!result.isValid) {
                logger_1.logger.error(`OTP verification failed: ${result.reason}`);
                throw new appError_1.default(400, `OTP verification failed: ${result.reason}`);
            }
            return { verificationId: existingVerification.id };
        };
        this.verificationRepository = dataSource_1.AppDataSource.getRepository("Verification");
    }
}
exports.default = new VerificationService();
