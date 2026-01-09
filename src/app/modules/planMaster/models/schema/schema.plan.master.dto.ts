import { IS_MANDATORY_NUMBER_SCHEMA, NUMBER_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";

export const createPlanMasterSchema = 
    z.object(
        {
            callLimits: NUMBER_SCHEMA("callLimits")
                .gt(0, {error: "callLimits should be greater than 0."}),
            chatLimits: NUMBER_SCHEMA("chatLimits")
                .gt(0, "chatLimits should be greater than 0."),
            validity: NUMBER_SCHEMA("validity")

        }
    )