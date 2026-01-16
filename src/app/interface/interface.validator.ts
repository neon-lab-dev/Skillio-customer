import { AppRequest } from "@neon-lab-dev/platform";

export interface Validator {


    validate( req : AppRequest ): Promise<void> | never;

}