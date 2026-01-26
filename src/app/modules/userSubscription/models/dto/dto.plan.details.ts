import { AutoMap } from "@automapper/classes";
import { PlanType } from "../../../planMaster/enum/PlanType";
import { ProfileVisibility } from "../../../planMaster/enum/ProfileVisibility";

export class PlanDetails {

    @AutoMap()
    callLimits?: number;
    @AutoMap()
    chatLimits?: number;
    @AutoMap()
    validity?: number;
    @AutoMap()
    profileVisibility?: ProfileVisibility;
    @AutoMap()
    priceInPaise?: number;
    @AutoMap()
    priority?: number;
    @AutoMap()
    code?: string;
    @AutoMap()
    version?: number;
    @AutoMap()
    type?: PlanType;
    
}