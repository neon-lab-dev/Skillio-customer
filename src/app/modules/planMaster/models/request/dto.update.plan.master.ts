import { AppRequest } from "@neon-lab-dev/platform";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";

export class UpdatePlanMasterRequestDto implements AppRequest {

    id!:string;
    description!:string;
    callLimits!:number;
    chatLimits!:number;
    priceInPaise!:number;
    validity!:number;
    profileVisibility!:number;
    status!:PlanMasterStatus;
    active!:boolean;
    deleted!: boolean;

    public static of(id: string, active: boolean) {
        let retVal = new UpdatePlanMasterRequestDto();
        retVal.id = id;
        retVal.active = active;
        return retVal;
    }

    public static softDelete(id: string, deleted: boolean): UpdatePlanMasterRequestDto {
        let retVal = new UpdatePlanMasterRequestDto();
        retVal.id = id;
        retVal.deleted = deleted;
        return retVal;
    }

}