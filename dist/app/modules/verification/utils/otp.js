"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.generateOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const verificationRepository_1 = __importDefault(require("../../../repository/verificationRepository"));
const otpConfig_1 = require("../config/otpConfig");
const verificationEnum_1 = require("../../../enums/verificationEnum");
// Generate a 6 digit OTP   
const generateOtp = () => {
    if (otpConfig_1.otpConfig.testMode) {
        return "000000";
    }
    const otp = (crypto_1.default.randomInt(0, Math.pow(10, otpConfig_1.otpConfig.otpLength)) + 1000000).toString().substring(1);
    // Ensure the OTP is always 6 digits
    if (otp.length < otpConfig_1.otpConfig.otpLength) {
        return (Array(6 - otp.length)
            .fill(0)
            .join("") + otp);
    }
    return otp.substring(0, otpConfig_1.otpConfig.otpLength);
};
exports.generateOtp = generateOtp;
const verifyOtp = async (otpCode, phoneNumber) => {
    const existingOtp = await verificationRepository_1.default.findOneByPhoneNUmber(phoneNumber);
    if (!existingOtp) {
        return {
            isValid: false,
            reason: "NOT_FOUND",
        };
    }
    if (!otpConfig_1.otpConfig.testMode) {
        const now = Date.now();
        const expiresAt = new Date(existingOtp.expirationDate).getTime();
        if (expiresAt < now) {
            await verificationRepository_1.default.update(existingOtp.id, { otpCodeStatus: verificationEnum_1.OtpCodeStatus.EXPIRED });
            return {
                isValid: false,
                reason: "EXPIRED",
            };
        }
    }
    if (otpCode == existingOtp.otpCode) {
        await verificationRepository_1.default.update(existingOtp.id, { otpCodeStatus: verificationEnum_1.OtpCodeStatus.VERIFIED });
        return {
            isValid: true,
        };
    }
    return {
        isValid: false,
        reason: "MISMATCH",
    };
};
exports.verifyOtp = verifyOtp;
