import { AppResponseData } from "@neon-lab-dev/platform";
import { Privacy } from "../enum/privacyEnum";
import { Expose } from "class-transformer";

export class PrivacyResponseDto implements AppResponseData{
    @Expose()
    type!: Privacy;

    @Expose()
    userReferenceId!:string;
}