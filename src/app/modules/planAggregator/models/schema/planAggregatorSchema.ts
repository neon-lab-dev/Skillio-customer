import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";

export const fetchPlanAggregatorSchema= z.object({
    profileId: IS_MANDATORY_SCHEMA("profileId")
}).strict()