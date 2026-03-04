import { IS_MANDATORY, IS_MANDATORY_SCHEMA } from "@neon-lab-dev/platform";
import z from "zod";
import { callProvider } from "./enums/callProvider";


const callIdSchema= IS_MANDATORY_SCHEMA("callId")

export const createCallSchema=z.object({
    body:z.object({
        recipientId: IS_MANDATORY_SCHEMA("recipientId")
    })
})

export const acceptCallSchema=z.object({
    body:z.object({
        callId: callIdSchema
    })
})

export const rejectCallSchema=z.object({
    body:z.object({
        callId: callIdSchema
    })
})

export const endCallSchema=z.object({
    body:z.object({
        callId: callIdSchema
    })
})

export const sendIceCandidateSchema=z.object({
    body:z.object({
        profileId: IS_MANDATORY_SCHEMA("profileId"),
        callId: callIdSchema
    })
})

export const fetchTokenSchema= z.object({
    provider: IS_MANDATORY_SCHEMA("provider"),
    callerId: IS_MANDATORY_SCHEMA("callerID")
})

export const fetchCallsSchema= z.object({
    profileId: IS_MANDATORY_SCHEMA("profileId")
}).strict()