import z from "zod"
import { privacyType } from "../../enums/privacyEnum"
import { IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform"

export const updatePrivacySchema= z.object({
    id: IS_MANDATORY_SCHEMA("id"),
    type: z.nativeEnum(privacyType)
}).strict()