import { AppRequest } from "@neon-lab-dev/platform";
import { Privacy } from "../enum/privacyEnum";

export class CreatePrivacyRequest implements AppRequest{
    type!: Privacy;
    userReferenceId!:string;
}