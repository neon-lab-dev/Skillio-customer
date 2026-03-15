import { AppError, ERROR_CODES, HTTP_STATUS } from "@neon-lab-dev/platform";

export class ExternalApiError extends AppError{
    constructor(message: string){
        super(ERROR_CODES.EXTERNAL_API_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message
        );
    } 
}