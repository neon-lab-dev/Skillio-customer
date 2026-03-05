import { AppRequest } from "@neon-lab-dev/platform";

export class UpdateProfileRequest implements AppRequest{
    id!:string;

    firstName!:string;

    lastName!:string;

    totalEvents!:number;
}