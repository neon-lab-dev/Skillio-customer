import { AppResponseData } from "@neon-lab-dev/platform";
import { PlanType } from "../../enum/PlanType";
import { ProfileVisibility } from "../../enum/ProfileVisibility";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";

export class PlanMasterDetailsDto implements AppResponseData {

    id?: string;
    callLimits?: number;
    chatLimits?: number;
    validity?:number;
    active?:boolean;
    status?:PlanMasterStatus;
    profileVisibility?:ProfileVisibility;
    description?:string;
    priceInPaise?:number;
    priority?:number;
    code?:string;
    version?:number;
    type?:PlanType;
}