"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.resendOtpSchema = exports.verificationRequestSchema = void 0;
const zod_1 = require("zod");
const verificationEnum_1 = require("./enums/verificationEnum");
exports.verificationRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string"
        }).min(1, "Phone number cannot be empty"),
        purpose: zod_1.z.nativeEnum(verificationEnum_1.verificationPurpose, {
            required_error: "Purpose is required",
            invalid_type_error: "Invalid purpose value"
        })
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
});
exports.resendOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string"
        }).min(1, "Phone number cannot be empty"),
        verificationId: zod_1.z.string({
            required_error: "Verification ID is required",
            invalid_type_error: "Verification ID must be a string"
        }).min(1, "Verification ID cannot be empty")
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
});
exports.verifyOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        verificationId: zod_1.z.string({
            required_error: "Verification ID is required",
            invalid_type_error: "Verification ID must be a string"
        }).min(1, "Verification ID cannot be empty"),
        otpCode: zod_1.z.string({
            required_error: "OTP code is required",
            invalid_type_error: "OTP code must be a string"
        }).min(1, "OTP code cannot be empty")
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
});
