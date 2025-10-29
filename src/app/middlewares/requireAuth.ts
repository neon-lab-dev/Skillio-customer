import catchAsyncError from "../utils/catchAsyncError";
import { Request, Response ,NextFunction } from "express";
import sendResponse from "./sendResponse";
import { getJwtConfig } from "../modules/registration/config/jwtConfig";
import registrationRepository from "../repository/registrationRepository";
import logger from "../utils/logger";

import jwt , {JwtPayload} from "jsonwebtoken";
import AppError from "../errors/appError";

export interface DecodedToken extends JwtPayload {
    id: string;
  }

export const verifyToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.error("No authorization header provided");
        throw new AppError(401, "No authorization header provided");
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        logger.error("Invalid authorization token");
        throw new AppError(401, "Invalid authorization token");
    }

    const jwtConfig= await getJwtConfig();

    const decoded = jwt.verify(token, jwtConfig.JWT_ACCESS_SECRET as string) as DecodedToken;

    const profile= await registrationRepository.findProfileById(decoded.profileId);

    if(!profile) return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access"
    });

    req.user= decoded

    next();
});