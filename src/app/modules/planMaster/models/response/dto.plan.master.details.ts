import { AppResponseData } from "@neon-lab-dev/platform";
import { PlanType } from "../../enum/PlanType";
import { ProfileVisibility } from "../../enum/ProfileVisibility";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";
import { AutoMap } from "@automapper/classes";

export class PlanMasterDetailsDto implements AppResponseData {

    @AutoMap()
    id?: string;
    @AutoMap()
    callLimits?: number;
    @AutoMap()
    chatLimits?: number;
    @AutoMap()
    validity?:number;
    @AutoMap()
    active?:boolean;
    @AutoMap()
    status?:PlanMasterStatus;
    @AutoMap()
    profileVisibility?:ProfileVisibility;
    @AutoMap()
    description?:string;
    @AutoMap()
    priceInPaise?:number;
    @AutoMap()
    priority?:number;
    @AutoMap()
    code?:string;
    @AutoMap()
    version?:number;
    @AutoMap()
    type?:PlanType;
}