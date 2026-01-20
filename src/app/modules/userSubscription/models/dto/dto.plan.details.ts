import { PlanType } from "../../../planMaster/enum/PlanType";
import { ProfileVisibility } from "../../../planMaster/enum/ProfileVisibility";

export class PlanDetails {

    callLimits?: number;
    chatLimits?: number;
    validity?: number;
    profileVisibility?: ProfileVisibility;
    priceInPaise?: number;
    priority?: number;
    code?: string;
    version?: number;
    type?: PlanType;
    
}