"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOTP = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const otp_1 = require("../entity/otp");
const dataSource_1 = require("../db/dataSource");
// Generate a 6 digit OTP
const generateOTP = () => {
    const otp = (crypto_1.default.randomInt(0, 1000000) + 1000000).toString().substring(1);
    if (otp.length === 6) {
        return otp;
    }
    if (otp.length < 6) {
        //add 0 to the start of the otp
        return (Array(6 - otp.length)
            .fill(0)
            .join("") + otp);
    }
    return otp.substring(0, 6);
};
exports.generateOTP = generateOTP;
const validateOTP = (otpCode, otpExpirationDate, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = Date.now();
    const expiresAt = new Date(otpExpirationDate).getTime();
    if (expiresAt < now) {
        return {
            isValid: false,
            reason: "EXPIRED",
        };
    }
    const existingOTP = yield dataSource_1.AppDataSource.getRepository(otp_1.OTP).findOne({
        where: {
            user: { id: userId },
        },
    });
    if (!existingOTP) {
        return {
            isValid: false,
            reason: "NOT_FOUND",
        };
    }
    if (otpCode == existingOTP.otpCode) {
        return {
            isValid: true,
        };
    }
    return {
        isValid: false,
        reason: "MISMATCH",
    };
});
exports.validateOTP = validateOTP;
