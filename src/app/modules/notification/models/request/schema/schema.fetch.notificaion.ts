import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";

export const fetchNotificaionSchema= z.object({
    profileId: IS_MANDATORY_SCHEMA("profileId")
})