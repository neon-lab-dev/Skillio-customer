import {ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSource } from "../interface/error";
import handleZodError from "../errors/zodError";
import AppError from "../errors/appError";
import { NotFoundError } from "@neon-lab-dev/platform";
import { AppValidationError } from "@neon-lab-dev/platform";


const globalErrorHandler : ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let error=""
    let message ="Something went wrong!";

    let errorSource: TErrorSource = [{
        path: '',
        message: 'Something went wrong!'
    }];

    if (err instanceof AppValidationError){
        statusCode = err.statusCode;
        error= err.message;
        message = err.details as string;

    }else if (err instanceof NotFoundError){
        statusCode = err.statusCode;
        error= err.message;
        message = err.details as string;
    }
    else if(err instanceof ZodError){
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSource = simplifiedError?.errorSources

        res.status(statusCode).json({
            success: false,
            message,
            errorSource
        })
    }
    else if(err instanceof AppError){
        statusCode = err?.statusCode;
        message = err?.message;
    }
    else if(err instanceof Error){
        message = err?.message;
    }

     res.status(statusCode).json({
     success: false,
     error,
     message
    })

    return;
   }

   export default globalErrorHandler;