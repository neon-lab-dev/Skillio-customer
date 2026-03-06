import { AutoMap } from "@automapper/classes";
import { AppResponseData } from "@neon-lab-dev/platform";
import { ProfileVisibility } from "../../../planMaster/enum/ProfileVisibility";

export class planAggregatorResponseDto implements AppResponseData{
    @AutoMap()
    callLimits!: number;

    @AutoMap()
    chatLimits!: number;

    @AutoMap()
    profileVisibility!: ProfileVisibility;

    @AutoMap()
    userSubscriptionIds!: string[]

    @AutoMap()
    activePlans!: number;
}