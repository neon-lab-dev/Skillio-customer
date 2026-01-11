import { AppRequest, SearchCriteria } from "@neon-lab-dev/platform";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";
import { PlanType } from "../../enum/PlanType";
import { ProfileVisibility } from "../../enum/ProfileVisibility";

export class PlanMasterSearchCriteria extends SearchCriteria implements AppRequest {

    constructor(){
        super();
    }

    ids!: Set<string>;

    codes?: Set<string>;

    type?: PlanType;

    profileVisibility?: ProfileVisibility;

    active?: boolean;

    status?: PlanMasterStatus;

    priceInPaiseMax?: number;

    priceInPaiseMin?: number;

    validityMin?: number;

}