import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";

export const createUserSubscriptionSchema =
    z.object(
        {
            planId: IS_MANDATORY_SCHEMA("Plan Id")
        }
    );