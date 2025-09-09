import verificationServices from "./verification.services";
import catchAsyncError from "../../utils/catchAsyncError";
import { Request , Response , NextFunction } from "express";
import sendResponse from "../../middlewares/sendResponse";
import { VerificationDTO } from "./verifciation.dto";

class VerificationController {

    // verification request controller
    verificationRequest= catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const verificationData= new VerificationDTO(req.body);

        const result= await verificationServices.verificationRequest(verificationData.toJSON());

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Verification request created successfully",
            data: result
        })
    })

    // resend otp controller
    reSendOtp=catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {phoneNumber , verificationId }=req.body;
        
        const result= await verificationServices.reSendOtp(phoneNumber , verificationId);


        if(result.success==true){
            return sendResponse(res , {
                statusCode: 200,
                success: true,
                message: "OTP resent successfully",
                data: result
            })
        }else{
            return sendResponse(res , {
                statusCode: 500,
                success: false,
                message: "Failed to resend OTP",
                data: result
            })
        }
    })


    // verify otp controller
    verifyOtp=catchAsyncError(async(req:Request , res:Response , next:NextFunction)=>{
        const {otpCode , verificationId}=req.body;

        const result= await verificationServices.verifyOtp(verificationId , otpCode , res);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "OTP verified successfully",
            data: result
        })
    })
}

export default new VerificationController();