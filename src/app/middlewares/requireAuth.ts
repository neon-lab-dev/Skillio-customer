import { Request, Response ,NextFunction } from "express";
import { AsyncContextService, BASIC_TOKEN, JwtService, TOKEN, USER_ID } from "@neon-lab-dev/platform";
import { UnauthorizedError } from "@neon-lab-dev/platform";
import { getJwtConfig } from "../modules/registration/config/jwtConfig";


export const verifyToken =(async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedError("no authorization header provided")
    }
    
    const token= JwtService.extractToken(authHeader);

    const jwtConfig=  await getJwtConfig();

    const decoded= await JwtService.validateAndDecodeToken(token , jwtConfig.JWT_ACCESS_SECRET);

    AsyncContextService.setUserId(decoded.profileId)
    AsyncContextService.set(TOKEN, token);

    req.user= decoded

    next();
});