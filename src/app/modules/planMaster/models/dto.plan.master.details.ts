import { AppRequest, AppResponseData } from "@neon-lab-dev/platform";
import { PlanType } from "../enum/PlanType";
import { ProfileVisibility } from "../enum/ProfileVisibility";

export class PlanMasterDetailsDto implements AppRequest, AppResponseData {

    id?: string;
    callLimits?: Number;
    chatLimits?: Number;
    validity?:Number;
    active?:boolean;
    profileVisibility?:ProfileVisibility;
    description?:string;
    priority?:Number;
    code?:string;
    version?:string;
    type?:PlanType;
}