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
const dataSource_1 = require("../../db/dataSource");
const logger_1 = require("../../utils/logger");
const appError_1 = __importDefault(require("../../errors/appError"));
const generateOtp_1 = require("../../utils/generateOtp");
class AuthService {
    constructor() {
        this.userRepository = dataSource_1.AppDataSource.getRepository("user");
        this.otpRepository = dataSource_1.AppDataSource.getRepository("otp");
    }
    /**
     * Register a new user
     * @param userData - User data including phoneNumber, email, pin, isVerified
     * @param res - Express response object
     * @returns The created user
     */
    registerUser(userData, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phoneNumber, email, pin, isVerified } = userData;
            if (!phoneNumber && !email) {
                logger_1.logger.error("Phone number or email is required");
                throw new appError_1.default(400, "Phone number or email is required");
            }
            const existingUser = yield this.userRepository.findOne({
                where: [
                    { phoneNumber },
                    { email }
                ]
            });
            if (existingUser) {
                logger_1.logger.error("User already exists");
                throw new appError_1.default(400, "User already exists");
            }
            const newUser = this.userRepository.create({
                phoneNumber,
                email,
                pin,
                isVerified
            });
            const user = yield this.userRepository.save(newUser);
            if (!user) {
                logger_1.logger.error("Failed to create user");
                throw new appError_1.default(500, "Failed to create user");
            }
            const otp = (0, generateOtp_1.generateOTP)();
            const newOtp = this.otpRepository.create({
                otpCode: otp,
                expirationDate: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes expiration
                user: user
            });
            const savedOtp = yield this.otpRepository.save(newOtp);
            if (!savedOtp) {
                logger_1.logger.error("Failed to create OTP");
                throw new appError_1.default(500, "Failed to create OTP");
            }
            logger_1.logger.info("User created successfully");
            return user;
        });
    }
    /**
     * Verify OTP for user authentication
     * @param userId - User ID to verify
     * @param otpCode - OTP code to validate
     * @returns The verified user
     */
    verifyOtp(userId, otpCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingOtp = yield this.otpRepository.findOne({
                where: {
                    user: { id: userId },
                    otpCode: otpCode
                }
            });
            if (!existingOtp) {
                logger_1.logger.error("Invalid OTP");
                throw new appError_1.default(400, "Invalid OTP");
            }
            if (new Date(existingOtp.expirationDate) < new Date()) {
                logger_1.logger.error("OTP has expired");
                throw new appError_1.default(400, "OTP has expired");
            }
            const otpValidation = yield (0, generateOtp_1.validateOTP)(existingOtp.otpCode, existingOtp.expirationDate, userId);
            if (!otpValidation.isValid) {
                logger_1.logger.error(`OTP validation failed: ${otpValidation.reason}`);
                throw new appError_1.default(400, `OTP validation failed: ${otpValidation.reason}`);
            }
            // Mark user as verified
            const user = yield this.userRepository.findOneBy({ id: userId });
            if (!user) {
                logger_1.logger.error("User not found");
                throw new appError_1.default(404, "User not found");
            }
            user.isVerified = true;
            yield this.userRepository.save(user);
            // Optionally delete the OTP after successful verification
            yield this.otpRepository.remove(existingOtp);
            logger_1.logger.info("OTP verified successfully");
            return user;
        });
    }
    /**
     * Additional utility method to get user by ID
     * @param userId - User ID to find
     * @returns The user object
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id: userId });
            if (!user) {
                throw new appError_1.default(404, "User not found");
            }
            return user;
        });
    }
}
exports.default = new AuthService();
