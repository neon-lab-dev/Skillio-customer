import { NextFunction, Request, Response } from "express";
import { roles } from "../modules/registration/enums/registrationEnum";
import AppError from "../errors/appError";

class AuthorizeRole{

    public validateRole(role: string){
        return(req: Request ,res: Response, next: NextFunction)=>{
            if(!req.user){
                throw new AppError(401 , "unauthorized access")
            }

            if (req.user.role== roles.ADMIN){
                next();
                return;
            }

            if(req.user.role!= role){
                throw new AppError(401 , "unauthorized access")
            }
        }
    }
}

export default new AuthorizeRole()