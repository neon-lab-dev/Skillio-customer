import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";

export const fetchPlanAggregatorSchema= z.object({
    portfolioId: IS_MANDATORY_SCHEMA("portfolioId")
}).strict()