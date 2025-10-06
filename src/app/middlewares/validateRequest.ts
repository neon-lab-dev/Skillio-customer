import { NextFunction, Request, Response } from 'express';
import { AnyZodObject , ZodEffects } from 'zod';
import catchAsync from '../utils/catchAsyncError';

const validateRequest = (schema: AnyZodObject |ZodEffects<any> ) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                file: req.file
            });
            
            return next();
    });
};

export default validateRequest;