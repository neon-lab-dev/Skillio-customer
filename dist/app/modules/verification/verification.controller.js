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
const verification_services_1 = __importDefault(require("./verification.services"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
class VerificationController {
    constructor() {
        this.verificationRequest = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { phoneNumber, purpose } = req.body;
            const result = yield verification_services_1.default.verificationRequest({ phoneNumber, purpose }, res);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Verification request sent successfully",
                data: result
            });
        }));
        this.verifyOtp = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { verificationId } = req.params;
            const { otpCode } = req.body;
            const result = yield verification_services_1.default.verifyOtp(verificationId, otpCode);
            return (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "OTP verified successfully",
                data: result
            });
        }));
    }
}
exports.default = new VerificationController();
