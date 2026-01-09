import { AppResponseData } from "@neon-lab-dev/platform";
import { PlanType } from "../../enum/PlanType";

export class ShortPlanMasterDto implements AppResponseData {

    code?: string;
    description?:string;
    type?: PlanType;
    version?:Number;
    priority?:Number;
    active?:boolean;

}
