import { AppRequest } from "@neon-lab-dev/platform";
import { profileStatus } from "../../enums/registrationEnum";

export class UpdateProfileStatusRequest implements AppRequest{
    id!: string;
    status!: profileStatus;
}