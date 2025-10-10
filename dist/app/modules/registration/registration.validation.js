"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.registrationSchema = void 0;
const zod_1 = require("zod");
const registrationEnum_1 = require("./enums/registrationEnum");
const addressPinCodeConfig_1 = require("./config/addressPinCodeConfig");
const pinConfig_1 = require("./config/pinConfig");
const emailSchema = zod_1.z.string().email("Invalid email address");
const phoneSchema = zod_1.z.string().regex(/^(?:\+91|91|0)?[6-9]\d{9}$/, "Invalid phone number");
const validateNicknameUniqueness = (data) => {
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
const validateNamesWithProfileType = (data) => {
    const { firstName, lastName, groupName, profileType } = data;
    if (profileType === registrationEnum_1.ProfileType.INDIVIDUAL) {
        if (!firstName || !lastName) {
            return {
                valid: false,
                message: "First name and Last name are required for Individual profile type"
            };
        }
        else if (groupName) {
            return {
                valid: false,
                message: "Group name should not be provided for Individual profile type"
            };
        }
    }
    else if (profileType === registrationEnum_1.ProfileType.GROUP) {
        if (!groupName) {
            return {
                valid: false,
                message: "Group name is required for Group profile type"
            };
        }
        else if (firstName || lastName) {
            return {
                valid: false,
                message: "First name or Last name should not be provided for Group profile type"
            };
        }
    }
    return { valid: true };
};
const contactSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(registrationEnum_1.contactType, {
        required_error: "Contact type is required",
        invalid_type_error: "Invalid contact type"
    }),
    value: zod_1.z.string({
        required_error: "Contact value is required",
    }),
    primary: zod_1.z.boolean().default(false).optional(),
    isVerified: zod_1.z.boolean().default(false).optional(),
    verificationId: zod_1.z.string({
        required_error: "Verification ID is required",
        invalid_type_error: "Verification ID must be a string"
    })
}, {
    required_error: "Contact is required",
    invalid_type_error: "Contact must be an object"
})
    .refine((data) => {
    if (data.type === registrationEnum_1.contactType.EMAIL) {
        return emailSchema.safeParse(data.value).success;
    }
    if (data.type === registrationEnum_1.contactType.PHONE) {
        return phoneSchema.safeParse(data.value).success;
    }
    return true;
}, (data) => ({
    message: data.type === registrationEnum_1.contactType.EMAIL
        ? "valid email address is required"
        : "valid phone number is required",
    path: ["value"]
}));
const addressSchema = zod_1.z.object({
    streetAddress: zod_1.z.string({
        required_error: "Street address is required",
        invalid_type_error: "Street address must be a string"
    }).min(3, "Street address must be at least 3 characters long"),
    city: zod_1.z.string({
        required_error: "City is required",
        invalid_type_error: "City must be a string"
    }),
    country: zod_1.z.string({
        required_error: "Country is required",
        invalid_type_error: "Country must be a string"
    }),
    state: zod_1.z.string({
        required_error: "State is required",
        invalid_type_error: "State must be a string"
    }),
    pinCode: zod_1.z.number({
        required_error: "Pin code is required",
        invalid_type_error: "Pin code must be a number"
    }),
    location: zod_1.z.object({
        latitude: zod_1.z.number({
            required_error: "Latitude is required",
            invalid_type_error: "Latitude must be a number"
        }),
        longitude: zod_1.z.number({
            required_error: "Longitude is required",
            invalid_type_error: "Longitude must be a number"
        }),
        geoHash: zod_1.z.string().optional()
    }, {
        required_error: "Location is required",
        invalid_type_error: "Location must be an object"
    })
}, {
    required_error: "Address is required",
    invalid_type_error: "Address must be an object"
}).superRefine(async (data, ctx) => {
    const addressPinCodeConfig = await (0, addressPinCodeConfig_1.getAddressPinCodeConfig)();
    if (data.country.toUpperCase() in addressPinCodeConfig && data.pinCode.toString().length != addressPinCodeConfig.INDIA) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `Pin code must be ${addressPinCodeConfig.INDIA} digits long for ${data.country}`,
            path: ["pinCode"]
        });
    }
});
const portfolioSchema = zod_1.z.object({
    category: zod_1.z.string({
        required_error: "Category is required",
        invalid_type_error: "Category must be a string"
    })
        .regex(/^[A-Za-z\s]+$/, "Category must contain only alphabets "),
    subCategory: zod_1.z.string({
        required_error: "Sub-category is required",
        invalid_type_error: "Sub-category must be a string"
    })
        .regex(/^[A-Za-z\s]+$/, "Sub-category must contain only alphabets "),
    proficiency: zod_1.z.nativeEnum(registrationEnum_1.proficiecy, {
        required_error: "Proficiency is required",
        invalid_type_error: "Invalid proficiency type"
    }),
    totalEvents: zod_1.z.number({
        invalid_type_error: "Total events must be a number"
    }).optional(),
    bio: zod_1.z.string({
        invalid_type_error: "Bio must be a string"
    }).optional(),
    videoDocumentId: zod_1.z.string({
        required_error: "Video document ID is required",
        invalid_type_error: "Video document ID must be a string"
    }),
    imageDocumentId: zod_1.z.string({
        required_error: "Image document ID is required",
        invalid_type_error: "Image document ID must be a string"
    }),
    eventsDoneDocumentId: zod_1.z.string({
        invalid_type_error: "Events done document ID must be a string"
    }).optional()
}, {
    required_error: "Portfolio is required",
    invalid_type_error: "Portfolio must be an object"
}).refine((data) => {
    if (data.proficiency === registrationEnum_1.proficiecy.PROFESSIONAL) {
        return !!data.eventsDoneDocumentId;
    }
    return true;
}, {
    message: "Events done document ID is required for Professional proficiency",
    path: ["eventsDoneDocumentId"]
});
exports.registrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({
            invalid_type_error: "First name must be a string"
        })
            .optional()
            .nullable(),
        lastName: zod_1.z.string({
            invalid_type_error: "Last name must be a string"
        })
            .optional().nullable(),
        groupName: zod_1.z.string({
            invalid_type_error: "Group name must be a string"
        })
            .optional()
            .nullable(),
        nickName: zod_1.z.string({
            required_error: "Nick name is required",
            invalid_type_error: "Nick name must be a string"
        }).min(2, "Nick name must be at least 2 characters long"),
        pin: zod_1.z.string({
            required_error: "Pin is required",
            invalid_type_error: "Pin must be a string of digits"
        })
            .regex(/^\d+$/, "Pin must contain only digits"),
        profileType: zod_1.z.nativeEnum(registrationEnum_1.ProfileType, {
            required_error: "Profile type is required",
            invalid_type_error: "Invalid profile type"
        }),
        profileDocumentId: zod_1.z.string({
            required_error: "Profile document ID is required",
            invalid_type_error: "Profile document ID must be a string"
        }),
        contacts: zod_1.z.array(contactSchema, {
            required_error: "contact is required",
            invalid_type_error: "Contacts must be an array"
        }),
        address: addressSchema,
        portfolio: portfolioSchema
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
        .refine((data) => {
        if (data.firstName && !/^[A-Za-z]+$/.test(data.firstName)) {
            return false;
        }
        if (data.lastName && !/^[A-Za-z]+$/.test(data.lastName)) {
            return false;
        }
        if (data.groupName && !/^[A-Za-z\s]+$/.test(data.groupName)) {
            return false;
        }
        return true;
    }, (data) => {
        if (data.firstName && !/^[A-Za-z]+$/.test(data.firstName)) {
            return {
                message: "First name must contain only alphabets",
                path: ["firstName"]
            };
        }
        if (data.lastName && !/^[A-Za-z]+$/.test(data.lastName)) {
            return {
                message: "Last name must contain only alphabets",
                path: ["lastName"]
            };
        }
        if (data.groupName && !/^[A-Za-z\s]+$/.test(data.groupName)) {
            return {
                message: "Group name must contain only alphabets and spaces",
                path: ["groupName"]
            };
        }
        return {
            message: "Invalid name format",
        };
    })
        .refine((data) => validateNicknameUniqueness(data).valid, (data) => ({
        message: validateNicknameUniqueness(data).message,
        path: ["nickName"]
    }))
        .refine((data) => validateNamesWithProfileType(data).valid, (data) => ({
        message: validateNamesWithProfileType(data).message,
    })).superRefine(async (data, ctx) => {
        const pinConfig = await (0, pinConfig_1.getPinConfig)();
        if (data.pin.toString().length != pinConfig.MAX_LENGTH) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: `Pin must be ${pinConfig.MAX_LENGTH} digits long`,
            });
        }
    })
});
exports.LoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        credential: zod_1.z.string({
            required_error: "credential is required",
            invalid_type_error: "credential must be a string"
        }),
        pin: zod_1.z.string({
            required_error: "Pin is required",
            invalid_type_error: "Pin must be a string of digits"
        })
    })
        .superRefine(async (data, ctx) => {
        const pinConfig = await (0, pinConfig_1.getPinConfig)();
        if (data.pin.toString().length != pinConfig.MAX_LENGTH) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: `Pin must be ${pinConfig.MAX_LENGTH} digits long`,
            });
        }
    })
});
