import { z } from 'zod';
import { verificationPurpose } from './enums/verificationEnum';
import { IS_MANDATORY_SCHEMA, mandatoryTypeError } from '@neon-lab-dev/platform';

const phoneSchema = IS_MANDATORY_SCHEMA("Phone number")
    .min(1, "Phone number cannot be empty");
const verificationIdSchema = IS_MANDATORY_SCHEMA("Verification Id")
    .min(1, "Verification ID cannot be empty");

const requestRequiredError = mandatoryTypeError("Request body", "object");

export const verificationRequestSchema = z.object({
    body: z.object({
        phoneNumber: phoneSchema,
        purpose: z.nativeEnum(verificationPurpose, {
            error: mandatoryTypeError("purpose", "VerificationPurpose")
        })
    }, {
        error: requestRequiredError
    })
});

export const resendOtpSchema = z.object({
    body: z.object({
        phoneNumber: phoneSchema,
        verificationId: verificationIdSchema,
    }, {
        error: requestRequiredError
    })
});

export const verifyOtpSchema = z.object({
    body: z.object({
        verificationId: verificationIdSchema,
        otpCode:IS_MANDATORY_SCHEMA("OTP code").min(1, "OTP code cannot be empty")
    }, {
        error: requestRequiredError
    })
});