import { z } from 'zod';
import { verificationPurpose } from './enums/verificationEnum';

export const verificationRequestSchema = z.object({
    body: z.object({
        phoneNumber: z.string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string"
        }).min(1, "Phone number cannot be empty"),
        purpose: z.nativeEnum(verificationPurpose, {
            required_error: "Purpose is required",
            invalid_type_error: "Invalid purpose value"
        })
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
});

export const resendOtpSchema = z.object({
    body: z.object({
        phoneNumber: z.string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string"
        }).min(1, "Phone number cannot be empty"),
        verificationId: z.string({
            required_error: "Verification ID is required",
            invalid_type_error: "Verification ID must be a string"
        }).min(1, "Verification ID cannot be empty")
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
});

export const verifyOtpSchema = z.object({
    body: z.object({
        verificationId: z.string({
            required_error: "Verification ID is required",
            invalid_type_error: "Verification ID must be a string"
        }).min(1, "Verification ID cannot be empty"),
        otpCode: z.string({
            required_error: "OTP code is required",
            invalid_type_error: "OTP code must be a string"
        }).min(1, "OTP code cannot be empty")
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
});