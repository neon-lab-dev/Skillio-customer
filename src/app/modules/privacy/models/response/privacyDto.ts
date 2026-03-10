import { AutoMap } from "@automapper/classes";
import {  AppResponseData } from "@neon-lab-dev/platform";
import { privacyType } from "../../enums/privacyEnum";

export class PrivacyDto implements AppResponseData{
    id!: string;

    @AutoMap()
    type!: privacyType

    @AutoMap()
    profileId!: string
}