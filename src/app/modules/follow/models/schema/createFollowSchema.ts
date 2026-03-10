import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";

export const CreateFollowSchema= z.object({
    followingId: IS_MANDATORY_SCHEMA("followingId")
}).strict()