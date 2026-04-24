import { ProfileVisibility } from "../../../planMaster/enum/ProfileVisibility";

export class PlanAggregatorInterface {
        callLimits!: number;
        chatLimits!: number;
        profileVisibility!: ProfileVisibility;
        userSubscriptionIds!: string[];
        profileId!: string;
        activePlans!: number;
}