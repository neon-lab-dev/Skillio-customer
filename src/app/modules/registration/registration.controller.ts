import registrationProxy from "./registration.proxy";
import { Request, Response } from "express";
import catchAsyncError from "../../utils/catchAsyncError";
import sendResponse from "../../middlewares/sendResponse";
import { RegistrationDTO } from "./registration.dto";
import { controllerLogging } from "../../utils/controllerLogging";

class RegistrationController{

    // create/register a profile
    createProfile= controllerLogging(
        "RegistrationController.createProfile",
        catchAsyncError(async(req:Request , res:Response)=>{
        const profileData= new RegistrationDTO(req.body);

        const result= await registrationProxy.createProfile({...profileData.toJSON()})

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
    getProfile= controllerLogging(
        "RegistrationController.getProfile",
        catchAsyncError(async(req:Request , res:Response)=>{
        const {id}= req.params;

        const result= await registrationProxy.getProfile(id);

        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Profile fetched successfully",
            data: result
            })
        })
    );   


    // get profiles
    getProfiles= controllerLogging(
        "RegistrationController.getProfiles",
        catchAsyncError(async(req:Request , res:Response)=>{
        const page= req.query.page as string;
        const limit= req.query.limit as string;

        const result= await registrationProxy.getProfiles(page , limit);
        return sendResponse(res , {
            statusCode: 200,
            success: true,
            message: "Profiles fetched successfully",
            data: result
            })
        })
    )
}

export default new RegistrationController();