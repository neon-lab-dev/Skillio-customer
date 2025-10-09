import {z} from "zod";
import { ProfileType, contactType, proficiecy } from "./enums/registrationEnum";
import { getAddressPinCodeConfig } from "./config/addressPinCodeConfig";
import { getPinConfig } from "./config/pinConfig";


const emailSchema= z.string().email("Invalid email address");
const phoneSchema= z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");


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


const validateNamesWithProfileType=(data:{
    firstName?: string | null;
    lastName?: string | null;
    groupName?: string | null;
    profileType: ProfileType;
}):{valid: boolean; message?: string}=>{
    const {firstName, lastName, groupName, profileType}= data;

    if(profileType === ProfileType.INDIVIDUAL){
        if(!firstName || !lastName){
            return {
                valid: false,
                message: "First name and Last name are required for Individual profile type"
            }
        }
    }else if(profileType === ProfileType.GROUP){
        if(!groupName){
            return {
                valid: false,
                message: "Group name is required for Group profile type"
            }
        }
    }

    return {valid: true};
}

const contactSchema = z.object({
    type: z.nativeEnum(contactType, {
        required_error: "Contact type is required",
        invalid_type_error: "Invalid contact type"
    }),
    value: z.string({
        required_error: "Contact value is required",
    }),
    primary: z.boolean().default(false).optional(),
    isVerified: z.boolean().default(false).optional() ,
    verificationId: z.string({
        required_error: "Verification ID is required",
        invalid_type_error: "Verification ID must be a string"
    })
} , {
    required_error: "Contact is required",
    invalid_type_error: "Contact must be an object"
})
.refine(
    (data) => {
        if (data.type === contactType.EMAIL) {
            return emailSchema.safeParse(data.value).success;
        }
        if (data.type === contactType.PHONE) {
            return phoneSchema.safeParse(data.value).success;
        }
        return true;
    },
    (data) => ({
        message: data.type === contactType.EMAIL 
            ? "valid email address is required" 
            : "valid phone number is required",
        path: ["value"]
    })
);

const addressSchema =z.object({
    streetAddress: z.string({
        required_error: "Street address is required",
        invalid_type_error: "Street address must be a string"
    }),
    city: z.string({
        required_error: "City is required",
        invalid_type_error: "City must be a string"
    }),
    country: z.string({
        required_error: "Country is required",
        invalid_type_error: "Country must be a string"
    }),
    state: z.string({
        required_error: "State is required",
        invalid_type_error: "State must be a string"
    }),
    pinCode: z.number({
        required_error: "Pin code is required",
        invalid_type_error: "Pin code must be a number"
    }),
    location: z.object({
        latitude: z.number({
            required_error: "Latitude is required",
            invalid_type_error: "Latitude must be a number"
        }),
        longitude: z.number({
            required_error: "Longitude is required",
            invalid_type_error: "Longitude must be a number"
        }),
        geoHash: z.string().optional()
    })
} , {
    required_error: "Address is required",
    invalid_type_error: "Address must be an object"
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

const portfolioSchema = z.object({
    category: z.string({
        required_error: "Category is required",
        invalid_type_error: "Category must be a string"
    })
    .regex(/^[A-Za-z\s]+$/, "Category must contain only alphabets "),
    subCategory: z.string({
        required_error: "Sub-category is required",
        invalid_type_error: "Sub-category must be a string"
    })
    .regex(/^[A-Za-z\s]+$/, "Sub-category must contain only alphabets "),
    proficiency: z.nativeEnum(proficiecy, {
        required_error: "Proficiency is required",
        invalid_type_error: "Invalid proficiency type"
    }),
    totalEvents: z.number({
        invalid_type_error: "Total events must be a number"
    }).optional(),
    bio: z.string({
        invalid_type_error: "Bio must be a string"
    }).optional(),
    videoDocumentId: z.string({
        required_error: "Video document ID is required",
        invalid_type_error: "Video document ID must be a string"
    }),
    imageDocumentId: z.string({
        required_error: "Image document ID is required",
        invalid_type_error: "Image document ID must be a string"
    }),
    eventsDoneDocumentId: z.string({
        invalid_type_error: "Events done document ID must be a string"
    }).optional()
} , {
    required_error: "Portfolio is required",
    invalid_type_error: "Portfolio must be an object"
})

export const registrationSchema= z.object({
    body: z.object({
        firstName: z.string({
            invalid_type_error: "First name must be a string"
        })
        .regex(/^[A-Za-z]+$/, "First name must contain only alphabets")
        .optional()
        .nullable(),
        lastName: z.string({
            invalid_type_error: "Last name must be a string"
        }).regex(/^[A-Za-z]+$/, "Last name must contain only alphabets")
        .optional().nullable(),
        groupName:z.string({
            invalid_type_error: "Group name must be a string"
        })
        .regex(/^[A-Za-z\s]+$/, "Group name must contain only alphabets and spaces")
        .optional()
        .nullable(),
        nickName:z.string({
            required_error: "Nick name is required",
            invalid_type_error: "Nick name must be a string"
        }),
        pin: z.string({
            required_error: "Pin is required",
            invalid_type_error: "Pin must be a string of digits"
        })
        .regex(/^\d+$/, "Pin must contain only digits"),
        profileType:z.nativeEnum(ProfileType,{
            required_error: "Profile type is required",
            invalid_type_error: "Invalid profile type"
        }),
        profileDocumentId:z.string({
            required_error: "Profile document ID is required",
            invalid_type_error: "Profile document ID must be a string"
        }),
        contacts:z.array(contactSchema),
        address: addressSchema,
        portfolio: portfolioSchema
    } , {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
    .refine(
        (data) => validateNicknameUniqueness(data).valid,
        (data) => ({
            message: validateNicknameUniqueness(data).message!,
            path: ["nickName"]
        })
    )
    .refine(
        (data)=> validateNamesWithProfileType(data).valid,
        (data)=>({
            message: validateNamesWithProfileType(data).message!,
        })
    ).superRefine(async(data, ctx: z.RefinementCtx) => {
        const pinConfig= await getPinConfig();

        if(data.pin.toString().length != pinConfig.MAX_LENGTH){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Pin must be ${pinConfig.MAX_LENGTH} digits long`,
            })
        }
    })
})