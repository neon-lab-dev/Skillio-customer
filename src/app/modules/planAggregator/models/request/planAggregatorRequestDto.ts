import { AppRequest } from "@neon-lab-dev/platform";
import { ProfileVisibility } from "../../../planMaster/enum/ProfileVisibility";

export class PlanAggregatorRequestDto implements AppRequest{
    callLimits!: number;
    chatLimits!: number;
    profileVisibility!: ProfileVisibility;
    planId!: string;
}