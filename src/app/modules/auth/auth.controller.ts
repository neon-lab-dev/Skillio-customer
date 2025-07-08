import { authServices } from "./auth.services";
import catchAsyncError from "../../utils/catchAsyncError";
import { Request, Response  ,NextFunction } from "express";
import config from "../../config";
import sendResponse from "../../middlewares/sendResponse";
import { uploadImage } from "../../utils/uploadImage";
import getDataUri from "../../utils/getDataUri";
import { UploadImageResponse } from "../../utils/uploadImage";

// sigup controller
const createUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name , designation , linkedInUrl, writeUp ,email, password ,role, station } = req.body; 

    const user = await authServices.createUser({ name , designation ,email, linkedInUrl, writeUp ,role, password , station  });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user,
    });
});

// login user controller
const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authServices.loginUser({ email, password });

    const { accessToken, user} = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
            user: user,
            accessToken: accessToken,
        }
    });
});

// refresh token to get new access token controller
const refreshToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "Please login to access this resource",
            data: null,
        });
    }

    const result = await authServices.refreshToken(refreshToken);
    const { accessToken } = result;

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Access token refreshed successfully",
        data: {
            accessToken: accessToken
        },
    });
}
);

// create people
const createPeople = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name , linkedInUrl, writeUp ,email , station  , role } = req.body; 
    let {  attributes} = req.body;
    let photo: UploadImageResponse | undefined = undefined;
    attributes = JSON.parse(attributes);
    
    if (req.file) {
      photo = await uploadImage(
        getDataUri(req.file).content,
        getDataUri(req.file).fileName,
        "people"
      );
      if (!photo) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Failed to upload photo",
        });
      }
    }
    const poeple = await authServices.createPeople({ name  ,email, linkedInUrl, writeUp  , station ,photo ,role, attributes });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "poeple created successfully",
        data: poeple,
    });
});

// get all users controller
const getAllPeople= catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const people = await authServices.getPeople();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "people fetched successfully",
        data: people,
    });
});

// get single user controller
const getSinglePeople = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const people = await authServices.getPeopleById(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "people fetched successfully",
        data: people,
    });
})

// delete user controller
const deletePeople = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedPeople = await authServices.deletePeople(id , res);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: deletedPeople,
    });
});

// update user controller
const updatePeople = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name,role, linkedInUrl, writeUp, station  } = req.body;
    let { attributes } = req.body;
    attributes = JSON.parse(attributes);
    let photo: UploadImageResponse | undefined = undefined;
    if (req.file) {
        photo = await uploadImage(
            getDataUri(req.file).content,
            getDataUri(req.file).fileName,
            "user"
        );
        if (!photo) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Failed to upload photo",
            });
        }
    }
    const people = await authServices.updatePeople(id, { name,role, linkedInUrl, writeUp, station, photo , attributes} );
    sendResponse(res, { 
        statusCode: 200,
        success: true,
        message: "People updated successfully",
        data: people,
    });
});
    


export const authControllers = {
    createUser,
    loginUser,
    refreshToken,
    createPeople,
    getAllPeople,
    getSinglePeople,
    deletePeople,
    updatePeople
};