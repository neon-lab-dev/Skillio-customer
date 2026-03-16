import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";

export const createCategorySchema= z.object({
    name: IS_MANDATORY_SCHEMA("name")
}).strict()