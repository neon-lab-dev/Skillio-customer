import { Request, Response, NextFunction, RequestHandler } from 'express';
import { logController } from './logger';

export const controllerLogging = (
  controllerName: string,
  handler: RequestHandler
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const start = process.hrtime();
    
    // Log controller start with sanitized input
    const sanitizedInput = { ...req.body ,params: req.params , query:req.query };
    if (sanitizedInput.pin) delete sanitizedInput.pin;
    if (sanitizedInput.password) delete sanitizedInput.password;
    if(sanitizedInput.confirmPassword) delete sanitizedInput.confirmPassword;
    
    logController.start(controllerName, sanitizedInput);

    try {
      await handler(req, res, next);

      const diff = process.hrtime(start);
      const timeMs = diff[0] * 1000 + diff[1] / 1e6;
      
      logController.success(
        controllerName,
        res.statusCode,
        `${timeMs.toFixed(2)}ms`
      );
    } catch (err) {
      const diff = process.hrtime(start);
      const timeMs = diff[0] * 1000 + diff[1] / 1e6;
      
      logController.error(
        controllerName,
        err as Error,
        `${timeMs.toFixed(2)}ms`
      );

      next(err);
    }
  };
};
