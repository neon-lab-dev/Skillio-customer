import { AppRequest } from "@neon-lab-dev/platform";

export class ForgotPinRequest implements AppRequest{
    credential!: string;
    pin!:string;
    confirmPin!:string;
}