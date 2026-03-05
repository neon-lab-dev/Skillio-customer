import { AppRequest } from "@neon-lab-dev/platform";
import { ProfileVisibility } from "../../enum/ProfileVisibility";
import { PlanType } from "../../enum/PlanType";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";


export class CreatePlanMasterRequest implements AppRequest {

    code!:string;
    description!:string;
    type!:PlanType;
    callLimits!: number;
    chatLimits!: number;
    priceInPaise!:number;
    validity!: number;
    profileVisibility!:ProfileVisibility;
    status!: PlanMasterStatus;
    active!:boolean;
    priority!:number;
    
}