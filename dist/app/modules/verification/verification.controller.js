"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verification_services_1 = __importDefault(require("./verification.services"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const verifciation_dto_1 = require("./verifciation.dto");
class VerificationController {
    constructor() {
        // verification request controller
        this.verificationRequest = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const verificationData = new verifciation_dto_1.VerificationDTO(req.body);
            const result = await verification_services_1.default.verificationRequest(verificationData.toJSON());
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Verification request created successfully",
                data: result
            });
        });
        // resend otp controller
        this.reSendOtp = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { phoneNumber, verificationId } = req.body;
            const result = await verification_services_1.default.reSendOtp(phoneNumber, verificationId);
            if (result.success == true) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 200,
                    success: true,
                    message: "OTP resent successfully",
                    data: result
                });
            }
            else {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 500,
                    success: false,
                    message: "Failed to resend OTP",
                    data: result
                });
            }
        });
        // verify otp controller
        this.verifyOtp = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { otpCode, verificationId } = req.body;
            const result = await verification_services_1.default.verifyOtp(verificationId, otpCode, res);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "OTP verified successfully",
                data: result
            });
        });
    }
}
exports.default = new VerificationController();
