import { AppRequest } from "@neon-lab-dev/platform";

export class UpdatePinRequest implements AppRequest{
    credential!: string;
    pin!: string;
}