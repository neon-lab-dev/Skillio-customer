import { AppRequest } from "@neon-lab-dev/platform";
import { privacyType } from "../../enums/privacyEnum";

export class UpdatePrivacyRequest implements AppRequest{
    id!: string;
    type!: privacyType;
}