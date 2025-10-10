import registrationProxy from "./registration.proxy";
import { Request, Response } from "express";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../middlewares/sendResponse";
import { RegistrationDTO } from "./registration.dto";

class RegistrationController{

    // create/register a profile
    createProfile= catchAsyncError(async(req:Request , res:Response)=>{
        const profileData= new RegistrationDTO(req.body);

        const result= await registrationProxy.createProfile({...profileData.toJSON()})

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Profile created successfully",
            data: result
        })
    })

    // login user/profile
    loginUser= catchAsyncError(async(req:Request , res:Response)=>{
        const {credential , pin}= req.body;

        const result= await registrationProxy.loginUser(credential , pin);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: result
        })
    })

}

export default new RegistrationController();