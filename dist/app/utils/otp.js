"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dataSource_1 = require("../db/dataSource");
const otpConfig_1 = require("../config/otpConfig");
const verification_1 = require("../entity/verification");
const verification_2 = require("../entity/verification");
// Generate a 6 digit OTP
const generateOTP = () => {
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
exports.generateOTP = generateOTP;
const verifyOTP = async (otpCode, phoneNumber) => {
    const verification = dataSource_1.AppDataSource.getRepository(verification_1.Verification);
    const existingOTP = await verification.findOne({
        where: {
            phoneNumber: phoneNumber,
        },
    });
    if (!existingOTP) {
        return {
            isValid: false,
            reason: "NOT_FOUND",
        };
    }
    if (!otpConfig_1.otpConfig.testMode) {
        const now = Date.now();
        const expiresAt = new Date(existingOTP.expirationDate).getTime();
        if (expiresAt < now) {
            await verification.update({ phoneNumber: phoneNumber }, { otpCodeStatus: verification_2.OtpCodeStatus.EXPIRED });
            return {
                isValid: false,
                reason: "EXPIRED",
            };
        }
    }
    if (otpCode == existingOTP.otpCode) {
        await verification.update({ phoneNumber: phoneNumber }, { otpCodeStatus: verification_2.OtpCodeStatus.VERIFIED });
        return {
            isValid: true,
        };
    }
    return {
        isValid: false,
        reason: "MISMATCH",
    };
};
exports.verifyOTP = verifyOTP;
