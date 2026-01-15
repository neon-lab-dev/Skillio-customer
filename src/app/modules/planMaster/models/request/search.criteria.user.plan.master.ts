import { AppRequest, SearchCriteria } from "@neon-lab-dev/platform";
import { PlanType } from "../../enum/PlanType";

export class UserPlanMasterSearchCriteria extends SearchCriteria implements AppRequest {

    constructor(){
        super();
    }

    code!: string;

    type!: PlanType;

    priceInPaiseMax!: number;

    priceInPaiseMin!: number;

    validityMin?: number;


}