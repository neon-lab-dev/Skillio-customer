import { AppDataSource } from "../../db/dataSource";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { Response } from "express";
import { TUser } from "./auth.interface";
import { generateOTP, validateOTP } from "../../utils/generateOtp";
import { Repository } from "typeorm";


class AuthService {
    private userRepository: Repository<any>;
    private otpRepository: Repository<any>;

    constructor() {
        this.userRepository = AppDataSource.getRepository("user");
        this.otpRepository = AppDataSource.getRepository("otp");
    }

    /**
     * Register a new user
     * @param userData - User data including phoneNumber, email, pin, isVerified
     * @param res - Express response object
     * @returns The created user
     */
    public async registerUser(userData: TUser, res: Response) {
        const { phoneNumber, email, pin, isVerified } = userData;

        if (!phoneNumber && !email) {
            logger.error("Phone number or email is required");
            throw new AppError(400, "Phone number or email is required");
        }

        const existingUser = await this.userRepository.findOne({
            where: [
                { phoneNumber },
                { email }
            ]
        });

        if (existingUser) {
            logger.error("User already exists");
            throw new AppError(400, "User already exists");
        }

        const newUser = this.userRepository.create({
            phoneNumber,
            email,
            pin,
            isVerified
        });

        const user = await this.userRepository.save(newUser);

        if (!user) {
            logger.error("Failed to create user");
            throw new AppError(500, "Failed to create user");
        }

        const otp = generateOTP();

        const newOtp = this.otpRepository.create({
            otpCode: otp,
            expirationDate: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes expiration
            user: user
        });

        const savedOtp = await this.otpRepository.save(newOtp);

        if (!savedOtp) {
            logger.error("Failed to create OTP");
            throw new AppError(500, "Failed to create OTP");
        }

        logger.info("User created successfully");
        return user;
    }

    /**
     * Verify OTP for user authentication
     * @param userId - User ID to verify
     * @param otpCode - OTP code to validate
     * @returns The verified user
     */

    public async verifyOtp(userId: string, otpCode: string) {
        const existingOtp = await this.otpRepository.findOne({
            where: {
                user: { id: userId },
                otpCode: otpCode
            }
        });

        if (!existingOtp) {
            logger.error("Invalid OTP");
            throw new AppError(400, "Invalid OTP");
        }

        if (new Date(existingOtp.expirationDate) < new Date()) {
            logger.error("OTP has expired");
            throw new AppError(400, "OTP has expired");
        }

        const otpValidation = await validateOTP(existingOtp.otpCode, existingOtp.expirationDate, userId);

        if (!otpValidation.isValid) {
            logger.error(`OTP validation failed: ${otpValidation.reason}`);
            throw new AppError(400, `OTP validation failed: ${otpValidation.reason}`);
        }

        // Mark user as verified
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            logger.error("User not found");
            throw new AppError(404, "User not found");
        }

        user.isVerified = true;
        await this.userRepository.save(user);

        // Optionally delete the OTP after successful verification
        await this.otpRepository.remove(existingOtp);

        logger.info("OTP verified successfully");
        return user;
    }

    /**
     * Additional utility method to get user by ID
     * @param userId - User ID to find
     * @returns The user object
     */
    public async getUserById(userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new AppError(404, "User not found");
        }
        return user;
    }

}

export default new AuthService();