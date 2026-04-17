import { AppRequest } from "@neon-lab-dev/platform";

export class CheckIfPinSetRequest implements AppRequest{
    credential!:string;
}