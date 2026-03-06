import { AppError, ERROR_CODES, HTTP_STATUS } from "@neon-lab-dev/platform";

export class OptimisticLockError extends AppError{
    constructor(){
        super(ERROR_CODES.CONFLICT,
            HTTP_STATUS.CONFLICT,
            `version conflict.`
        );
    } 
}