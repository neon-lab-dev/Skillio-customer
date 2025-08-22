import { AppDataSource } from "../../db/dataSource";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { Response } from "express";
import {  TVerification } from "./verification.interface";
import { otpConfig } from "../../config/otpConfig";
import { Repository } from "typeorm";
import { generateOTP  , verifyOTP} from "../../utils/otp";
import { OtpCodeStatus } from "../../entity/verification";


class VerificationService {
    private verificationRepository: Repository<any>;

    constructor() {
        this.verificationRepository = AppDataSource.getRepository("Verification");
    }

    verificationRequest= async (verificationData:Partial<TVerification> , res:Response)=>{
        const{ phoneNumber , purpose}= verificationData;

        if(!phoneNumber || !purpose) {
            logger.error("Phone number and purpose are required");
            throw new AppError(400, "Phone number and purpose are required");
        }

        const existingVerification= await this.verificationRepository.findOne({
            where: {
                phoneNumber: phoneNumber,
                purpose: purpose
            }
        });

        if(existingVerification){
            logger.info("Verification request already exists");
            throw new AppError(409, "Verification request already exists");
        }

        const otpCode= generateOTP();

        const newVerification=this.verificationRepository.create({
            phoneNumber: phoneNumber,
            purpose: purpose,
            otpCode,
            expirationDate: new Date(Date.now() + otpConfig.otpExpirationTime),
            otpCodeStatus: OtpCodeStatus.SENT
        })

        if(!newVerification){
            logger.error("Failed to create verification");
            throw new AppError(500, "Failed to create verification");
        }

        const verification=await this.verificationRepository.save(newVerification);

        if(!verification) {
            logger.error("Failed to save verification");
            throw new AppError(500, "Failed to save verification");
        }

        return {verification:{
            id: verification.id,
            purpose: verification.purpose,
        }};
    }

    verifyOtp=async(verificationId:string  , otpCode: string)=>{
        if(!verificationId || !otpCode) {
            logger.error("Verification ID and OTP code are required");
            throw new AppError(400, "Verification ID and OTP code are required");
        }

        const existingVerification= await this.verificationRepository.findOne({
            where: {
                id: verificationId
            }
        });

        if(!existingVerification) {
            logger.error("Verification not found");
            throw new AppError(404, "Verification not found");
        }

        const result= await verifyOTP(otpCode , existingVerification.phoneNumber);

        if(!result.isValid) {
            logger.error(`OTP verification failed: ${result.reason}`);
            throw new AppError(400, `OTP verification failed: ${result.reason}`);
        }

        return {verificationId: existingVerification.id}
    }       
}

export default new VerificationService();