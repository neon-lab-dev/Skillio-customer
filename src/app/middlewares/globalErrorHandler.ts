import {ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSource } from "../interface/error";
import handleZodError from "../errors/zodError";
import AppError from "../errors/appError";
import { AppValidationError } from "@neon-lab-dev/platform";


const globalErrorHandler : ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message ="Something went wrong!";

    
    let errorSourse: TErrorSource = [{
        path: '',
        message: 'Something went wrong!'
    }];

    if (err instanceof AppValidationError){
        statusCode = err.statusCode;
        message = err.details as string;

    } else if(err instanceof ZodError){
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSourse = simplifiedError?.errorSources
        
    }
    else if(err instanceof AppError){
        statusCode = err?.statusCode;
        message = err?.message;
        errorSourse = [{
            path: "",
            message : err?.message
        }]
    }
    else if(err instanceof Error){
        message = err?.message;
        errorSourse = [{
            path: "",
            message : err?.message
        }]
    }

     res.status(statusCode).json({
     success: false,
     message,
     errorSourse,
    })

    return;
   }

   export default globalErrorHandler;