import z from "zod";
import { SocialMeida } from "../../../../registration/enums/registrationEnum";
import { IS_MANDATORY_NUMBER_SCHEMA, IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";

export const createFollowsSchema=z.object({
        socialMedia: z.nativeEnum(SocialMeida),
    link: IS_MANDATORY_SCHEMA("link"),
    followers: IS_MANDATORY_NUMBER_SCHEMA("followers").optional(),
    following: IS_MANDATORY_NUMBER_SCHEMA("following").optional()
})