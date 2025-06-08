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
    const { name , designation , linkedInUrl, writeUp , password , station } = req.body;
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
    const user = await authServices.createUser({ name , designation , linkedInUrl, writeUp , password , station ,photo });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: user,
    });
});

// login user controller
const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;
    const result = await authServices.loginUser({ name, password });

    const { accessToken, user} = result;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

// get all users controller
const getAllUsers= catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const users = await authServices.getUsers();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
});

// get single user controller
const getSingleUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await authServices.getUserById(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User fetched successfully",
        data: user,
    });
})
    


export const authControllers = {
    createUser,
    loginUser,
    refreshToken,
    getAllUsers,
    getSingleUser
};