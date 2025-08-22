import verificationServices from "./verification.services";
import catchAsyncError from "../../utils/catchAsyncError";
import { Request , Response , NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";

class VerificationController {
    verificationRequest= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {phoneNumber , purpose}=req.body;

        const result= await verificationServices.verificationRequest({phoneNumber , purpose} , res);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Verification request sent successfully",
            data: result
        })
    })

    verifyOtp=catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {verificationId}=req.params;
        const {otpCode}=req.body;

        const result= await verificationServices.verifyOtp(verificationId , otpCode);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "OTP verified successfully",
            data: result
        })
    })
}

export default new VerificationController();