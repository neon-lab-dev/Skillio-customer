import { AppRequest } from "@neon-lab-dev/platform";

export class FetchPlanAggregatorRequestDto implements AppRequest{
    profileId!: string;
}