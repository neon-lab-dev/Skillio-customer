"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verification_services_1 = __importDefault(require("./verification.services"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
class VerificationController {
    constructor() {
        this.verificationRequest = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { phoneNumber, purpose } = req.body;
            const result = await verification_services_1.default.verificationRequest({ phoneNumber, purpose }, res);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Verification request sent successfully",
                data: result
            });
        });
        this.verifyOtp = (0, catchAsyncError_1.default)(async (req, res, next) => {
            const { verificationId } = req.params;
            const { otpCode } = req.body;
            const result = await verification_services_1.default.verifyOtp(verificationId, otpCode);
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
