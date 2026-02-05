import { HTTP_STATUS } from "@neon-lab-dev/platform";
import { ERROR_CODES } from "@neon-lab-dev/platform";
import { AppError } from "@neon-lab-dev/platform";

export class UnsupportedProviderError extends AppError{

    constructor(provider: string){
        super(ERROR_CODES.UNSUPPORTED_OPERATION,
            HTTP_STATUS.BAD_REQUEST,
            ` ${provider} has not been configured.`
        );
    } 

}