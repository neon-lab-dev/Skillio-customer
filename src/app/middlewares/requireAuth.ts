import { Request, Response ,NextFunction } from "express";
import { AsyncContextService, JwtService } from "@neon-lab-dev/platform";
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

    req.user= decoded

    next();
});