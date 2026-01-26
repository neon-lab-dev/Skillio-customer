import { AppResponseData } from "@neon-lab-dev/platform";
import { PlanType } from "../../enum/PlanType";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";

export class ShortPlanMasterDto implements AppResponseData {

    id?:string;
    code?: string;
    description?:string;
    type?: PlanType;
    version?:Number;
    priority?:Number;
    priceInPaise?:number;
    active?:boolean;
    status?:PlanMasterStatus;

}
