import registrationProxy from "./registration.proxy";
import { Request, Response } from "express";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../middlewares/sendResponse";
import { RegistrationDTO } from "./models/dto/dto.registration";
import { controllerLogging } from "../../utils/controllerLogging";

class RegistrationController{

    registerProfile= controllerLogging(
        "RegistrationController.createProfile",
        catchAsyncError(async(req:Request , res:Response)=>{
        const profileData= new RegistrationDTO(req.body);

        const result= await registrationProxy.registerProfile({...profileData.toJSON()})

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Profile created successfully",
            data: result
        })
    }))

    // login user/profile
    loginUser= controllerLogging(
        "RegistrationController.loginUser",
        catchAsyncError(async(req:Request , res:Response)=>{
        const {credential , pin}= req.body;
            
        const result= await registrationProxy.loginUser(credential , pin);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: result
        })
    }));


    // get profile
    getShortProfile= controllerLogging(
        "RegistrationController.getProfile",
        catchAsyncError(async(req:Request , res:Response)=>{
        const {id}= req.params;

        const result= await registrationProxy.getShortProfile(id as string);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Profile fetched successfully",
            data: result
            })
        })
    );   


    getProfileCount= controllerLogging(
        "RegistrationController.getProfileCount",
        catchAsyncError(async(req: Request , res: Response)=>{
            const result= await registrationProxy.getProfileCount();

            return sendResponse(res , {
                statusCode: 200,
                success: true,
                message: "profile count fetched successfully",
                data: result
            })
        })
    )
}

export default new RegistrationController();