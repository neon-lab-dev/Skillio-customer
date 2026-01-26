import { BOOLEAN_SCHEMA, IS_MANDATORY_NUMBER_SCHEMA, IS_MANDATORY_SCHEMA, IS_MANDATORY_STRING_ARRAY_SCHEMA, NUMBER_SCHEMA, TYPE_VALIDATION_SCHEMA, typeError } from "@neon-lab-dev/platform";
import z from "zod";
import { ProfileVisibility } from "../../enum/ProfileVisibility";
import { PlanType } from "../../enum/PlanType";
import { PlanMasterStatus } from "../../enum/PlanMasterStatus";

const profileVisibilitySchema = z.enum(
    Object.keys(ProfileVisibility),
    { error: typeError("profileVisibility", "ProfileVisibility") }
);

const typeSchema = z.enum(
    Object.keys(PlanType),
    { error: typeError("type", "PlanType") }
);

const statusSchema = z.enum(
    Object.keys(PlanMasterStatus),
    { error: typeError("status", "PlanMasterStatus") }
)

const callLimitSchema =NUMBER_SCHEMA("callLimits")
                .gt(0, { error: "callLimits should be greater than 0." });

const chatLimitSchema = NUMBER_SCHEMA("chatLimits")
                .gt(0, "chatLimits should be greater than 0.");

const validitySchema = NUMBER_SCHEMA("validity");

const idSchema= IS_MANDATORY_SCHEMA("id");

export const createPlanMasterSchema =
    z.object(
        {
            code: IS_MANDATORY_SCHEMA("code"),
            description: IS_MANDATORY_SCHEMA("description"),
            type: typeSchema,
            priceInPaise: IS_MANDATORY_NUMBER_SCHEMA("priceInPaise"),
            callLimits: callLimitSchema.optional(),
            chatLimits: chatLimitSchema.optional(),
            validity: validitySchema.optional(),
            profileVisibility: profileVisibilitySchema.optional(),
            status:statusSchema.optional(),
            active: BOOLEAN_SCHEMA("active").optional()
        }
    );

export const updatePlanMasterSchema =
    z.object(
        {
            id: idSchema,
            description: TYPE_VALIDATION_SCHEMA("description").optional(),
            priceInPaise: NUMBER_SCHEMA("priceInPaise").optional(),
            callLimits: callLimitSchema.optional(),
            chatLimits: chatLimitSchema.optional(),
            validity: validitySchema.optional(),
            profileVisibility: profileVisibilitySchema.optional(),
            status: statusSchema.optional(),
            active: BOOLEAN_SCHEMA("active").optional()
        }
    );

export const updateActivePlanMasterSchema = 
    z.object(
        {
            ids: IS_MANDATORY_STRING_ARRAY_SCHEMA("ids"),
            active: BOOLEAN_SCHEMA("active")
        }
    );

export const fetchByIdSchema=z.object({
    id: idSchema
})

export const deletePlanMasterSchema= z.object({
    ids: IS_MANDATORY_STRING_ARRAY_SCHEMA("ids"),
    hard: BOOLEAN_SCHEMA("hard").optional()
})