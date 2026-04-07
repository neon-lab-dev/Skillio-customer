import { z } from "zod";
import { ProfileType, SocialMeida, contactType, proficiecy, profileStatus, roles } from "./enums/registrationEnum";
import { getAddressPinCodeConfig } from "./config/addressPinCodeConfig";
import { getPinConfig } from "./config/pinConfig";
import { IS_MANDATORY, IS_MANDATORY_NUMBER_SCHEMA, IS_MANDATORY_SCHEMA, IS_MANDATORY_STRING_ARRAY_SCHEMA, mandatoryTypeError, NUMBER_SCHEMA, TYPE_VALIDATION_SCHEMA } from "@neon-lab-dev/platform";
import { credential } from "firebase-admin";


const emailSchema = z.string().email("Invalid email address");
const phoneSchema = z.string().regex(/^(?:\+91|91|0)?[6-9]\d{9}$/, "Invalid phone number");
const requestMandatoryError = mandatoryTypeError("Request", "object");

const nickNameSchema=IS_MANDATORY_SCHEMA("nickName").min(2 , "nickName must be at least 2 characters");
const citySchema= IS_MANDATORY_SCHEMA("city");
const countrySchema= IS_MANDATORY_SCHEMA("country");
const profileTypeSchema= z.nativeEnum(ProfileType, {
            error: mandatoryTypeError("profileType", "ProfileType")
        });

const proficiencySchema=z.nativeEnum(proficiecy, {
        error: mandatoryTypeError("proficiency", "Proficiency")
    });

const totalEventsSchema= NUMBER_SCHEMA("totalEvents");

const credentialSchema= IS_MANDATORY_SCHEMA("credential");


const validateNicknameUniqueness = (data: {
    nickName: string;
    firstName?: string | null;
    lastName?: string | null;
    groupName?: string | null;
}): { valid: boolean; message?: string } => {
    const nickName = data.nickName.toLowerCase().trim();

    const checks = [
        { value: data.firstName, name: "first name" },
        { value: data.lastName, name: "last name" },
        { value: data.groupName, name: "group name" }
    ];

    for (const check of checks) {
        if (check.value && nickName === check.value.toLowerCase().trim()) {
            return {
                valid: false,
                message: `Nickname cannot be the same as ${check.name}`
            };
        }
    }

    return { valid: true };
};


const validateNamesWithProfileType = (data: {
    firstName?: string | null;
    lastName?: string | null;
    groupName?: string | null;
    profileType: ProfileType;
}): { valid: boolean; message?: string } => {
    const { firstName, lastName, groupName, profileType } = data;

    if (profileType === ProfileType.INDIVIDUAL) {
        if (!firstName || !lastName) {
            return {
                valid: false,
                message: "First name and Last name are required for Individual profile type"
            }
        } else if (groupName) {
            return {
                valid: false,
                message: "Group name should not be provided for Individual profile type"
            }
        }
    } else if (profileType === ProfileType.GROUP) {
        if (!groupName) {
            return {
                valid: false,
                message: "Group name is required for Group profile type"
            }
        } else if (firstName || lastName) {
            return {
                valid: false,
                message: "First name or Last name should not be provided for Group profile type"
            }
        }
    }

    return { valid: true };
}

const contactSchema = z.object({
    type: z.nativeEnum(contactType, {
        error: mandatoryTypeError("type", "constantType")
    }),
    value: IS_MANDATORY_SCHEMA("contact value"),
    primary: z.boolean().default(false).optional(),
    isVerified: z.boolean().default(false).optional(),
    verificationId: IS_MANDATORY_SCHEMA("Verification ID").optional()
}, {
    error: mandatoryTypeError("contact body", "object")
})
    .refine((data)=>{
        if(data.type== contactType.PHONE){
                return !!data.verificationId;
        }
        return true
    } , {
        message:"verificationId is required for phone number"
    })
    .superRefine(
        (data, ctx) => {
            if (data.type == contactType.EMAIL) {
                if (!emailSchema.safeParse(data.value).success) {
                    ctx.addIssue(
                        {
                            code: z.ZodIssueCode.custom,
                            message: "valid email address is required",
                            path: ["value"]
                        }
                    );
                }
            }

            if (data.type == contactType.PHONE) {
                if (!phoneSchema.safeParse(data.value).success) {
                    ctx.addIssue(
                        {
                            code: z.ZodIssueCode.custom,
                            message: "valid phone number is required",
                            path: ["value"]
                        }
                    );
                }
            }
        }
    );

const addressSchema = z.object({
    streetAddress: IS_MANDATORY_SCHEMA("Street address")
        .min(3, "Street address must be at least 3 characters long"),
    city: IS_MANDATORY_SCHEMA("City"),
    country: IS_MANDATORY_SCHEMA("Country"),
    state: IS_MANDATORY_SCHEMA("State"),
    pinCode: IS_MANDATORY_NUMBER_SCHEMA("Pincode"),
    location: z.object({
        latitude: IS_MANDATORY_NUMBER_SCHEMA("Latitude"),
        longitude: IS_MANDATORY_NUMBER_SCHEMA("Longitude"),
        geoHash: z.string().optional()
    }, {
        error: mandatoryTypeError("location", "object")
    })
}, {
    error: mandatoryTypeError("Address", "object")
}).superRefine(async (data, ctx: z.RefinementCtx) => {
    const addressPinCodeConfig = await getAddressPinCodeConfig();

    if (data.country.toUpperCase() in addressPinCodeConfig && data.pinCode.toString().length != addressPinCodeConfig.INDIA) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Pin code must be ${addressPinCodeConfig.INDIA} digits long for ${data.country}`,
            path: ["pinCode"]
        });
    }
});

const hiringRateSchema=z.object({
    hourlyPricing: z.number(),
    dailyPricing: z.number(),
    weeklyPricing: z.number(),
    monthlyPricing: z.number()
})


const followsSchema= z.object({
    socialMedia: z.nativeEnum(SocialMeida),
    link: IS_MANDATORY_SCHEMA("link"),
    followers: IS_MANDATORY_NUMBER_SCHEMA("followers").optional(),
    following: IS_MANDATORY_NUMBER_SCHEMA("following").optional()
})

const portfolioSchema = z.object({
    category: IS_MANDATORY_SCHEMA("Category")
        .regex(/^[A-Za-z\s]+$/, "Category must contain only alphabets "),
    subCategory: IS_MANDATORY_SCHEMA("Sub-category")
        .regex(/^[A-Za-z\s]+$/, "Sub-category must contain only alphabets "),
    proficiency:proficiencySchema ,
    totalEvents: totalEventsSchema.optional(),
    bio: TYPE_VALIDATION_SCHEMA("bio").optional(),
    hiringRate: hiringRateSchema,
    follows: z.array(followsSchema, {
            error: mandatoryTypeError("follows", "array")
        }),
    videoDocumentIds: IS_MANDATORY_STRING_ARRAY_SCHEMA("Video Document Id"),
    imageDocumentIds: IS_MANDATORY_STRING_ARRAY_SCHEMA("Image document ID"),
    eventsDoneDocumentIds: IS_MANDATORY_STRING_ARRAY_SCHEMA("Events Document Id").optional()
}, {
    error: mandatoryTypeError("Portfolio", "object")
}).refine(
    (data) => {
        if (data.proficiency === proficiecy.PROFESSIONAL) {
            return !!data.eventsDoneDocumentIds && data.eventsDoneDocumentIds.length!=0;
        }
        return true;
    },
    {
        message: "Events done document ID is required for Professional proficiency",
        path: ["eventsDoneDocumentId"]
    }
)

export const registrationSchema = z.object({
    body: z.object({
        firstName: TYPE_VALIDATION_SCHEMA("firstName")
            .optional()
            .nullable(),
        lastName: TYPE_VALIDATION_SCHEMA("lastName")
            .optional().nullable(),
        groupName: TYPE_VALIDATION_SCHEMA("groupName")
            .optional()
            .nullable(),
        nickName: nickNameSchema,
        pin: IS_MANDATORY_SCHEMA("pin")
            .regex(/^\d+$/, "Pin must contain only digits"),
        profileType: profileTypeSchema,
        profileDocumentId: IS_MANDATORY_SCHEMA("Profile document ID"),
        role: z.nativeEnum(roles,{
            error: mandatoryTypeError("role", "role")
        }),
        contacts: z.array(contactSchema, {
            error: mandatoryTypeError("contacts", "array")
        }),
        address: addressSchema,
        portfolio: portfolioSchema
    }, {
        error: requestMandatoryError
    })
        .superRefine((data, ctx) => {
            if (data.firstName && !/^[A-Za-z]+$/.test(data.firstName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "First name must contain only alphabets",
                    path: ["firstName"],
                });
            }

            if (data.lastName && !/^[A-Za-z]+$/.test(data.lastName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Last name must contain only alphabets",
                    path: ["lastName"],
                });
            }

            if (data.groupName && !/^[A-Za-z\s]+$/.test(data.groupName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Group name must contain only alphabets and spaces",
                    path: ["groupName"],
                });
            }
        })
        .superRefine((data, ctx) => {
            const result = validateNicknameUniqueness(data);
            if (!result.valid) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: result.message!,
                    path: ["nickName"],
                });
            }
        })

        .superRefine((data, ctx) => {
            const result = validateNamesWithProfileType(data);
            if (!result.valid) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: result.message!,
                });
            }
        })
        .superRefine(async (data, ctx: z.RefinementCtx) => {
            const pinConfig = await getPinConfig();

            if (data.pin.toString().length != pinConfig.MAX_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Pin must be ${pinConfig.MAX_LENGTH} digits long`,
                })
            }
        })
})

export const LoginSchema = z.object({
    body: z.object({
        credential: IS_MANDATORY_SCHEMA("Credential"),
        pin: IS_MANDATORY_SCHEMA("Pin")
    })
        .superRefine(async (data, ctx: z.RefinementCtx) => {
            const pinConfig = await getPinConfig();

            if (data.pin.toString().length != pinConfig.MAX_LENGTH) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Pin must be ${pinConfig.MAX_LENGTH} digits long`,
                })
            }
        })
})

export const fetchProfilesSchema= z.object({
    ids: IS_MANDATORY_SCHEMA("ids").optional(),
    nickName: nickNameSchema.optional(),
    email: emailSchema.optional(),
    phoneNumber: phoneSchema.optional(),
    city: citySchema.optional(),
    country: countrySchema.optional(),
    profileType: profileTypeSchema.optional(),
    proficiecy: proficiencySchema.optional(),
    status: IS_MANDATORY_SCHEMA("status").optional(),
    page: IS_MANDATORY_SCHEMA("page").optional(),
    perPage: IS_MANDATORY_SCHEMA("perPage").optional()
})  

export const updateProfileStatusSchema=z.object({
    status: z.enum(profileStatus)
})

const idSchema= IS_MANDATORY_SCHEMA("id");

export const updateProfileSchema= z.object({
    id: idSchema,
    firstName: IS_MANDATORY_SCHEMA("firstName"),
    lastName: IS_MANDATORY_SCHEMA("lastName"),
    totalEvents: totalEventsSchema
}).strict()

export const fetchHiringRateSchema=z.object({
    portfolioId: IS_MANDATORY_SCHEMA("portfolioId")
})

export const updateHiringRateSchema=z.object({
    id: idSchema,
    hourlyPricing: z.number(),
    dailyPricing: z.number(),
    weeklyPricing: z.number(),
    monthlyPricing: z.number()
}).strict()

const pinSchema= IS_MANDATORY_SCHEMA("pin");

export const updatePinSchema=z.object({
    credential: credentialSchema,
    pin: pinSchema
}).strict()

export const fetchProfileDetailsSchema= z.object({
    id: idSchema
}).strict()

export const deleteProfileSchema= z.object({
    id: idSchema
}).strict()

export const forgotPinSchema= z.object({
        credential: credentialSchema,
        pin: pinSchema,
        confirmPin: IS_MANDATORY_SCHEMA("confirmPin")
}).strict()