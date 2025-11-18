import {z} from "zod";

const offerSchema = z.object({
    type: z.enum(["offer"], {
        required_error: "offer type is required",
        invalid_type_error: "Type must be 'offer'"
    }),
    sdp: z.string({
        required_error: "SDP is required",
        invalid_type_error: "SDP must be a string"
    }).min(1, "SDP cannot be empty")
} , {
    required_error: "offer is required",
    invalid_type_error:"offer must be an object"
}); 

const answerSchema = z.object({
    type: z.enum(["answer"], {
        required_error: "answer type is required",
        invalid_type_error: "Type must be 'answer'"
    }),
    sdp: z.string({
        required_error: "SDP is required",
        invalid_type_error: "SDP must be a string"
    }).min(1, "SDP cannot be empty")
} , {
    required_error: "answer is required",
    invalid_type_error:"answer must be an object"
});

const iceCandidateSchema = z.object({
    candidate: z.string({
        required_error: "Candidate string is required",
        invalid_type_error: "Candidate must be a string"
    }).min(1, "Candidate cannot be empty"),
    
    sdpMid: z.string().nullable().optional(),
    
    sdpMLineIndex: z.number({
        invalid_type_error: "sdpMLineIndex must be a number"
    }).int("sdpMLineIndex must be an integer")
      .nullable()
      .optional(),
    
    usernameFragment: z.string().nullable().optional()
});

export const createCallSchema=z.object({
    body:z.object({
        recipientId:z.string({
            required_error:"Recipient Id is required",
            invalid_type_error:"Recipient Id must be a string"
        })
    },{
        required_error:"Request body is required",
        invalid_type_error:"Request body must be an object"
    })
})

export const updateCallSchema=z.object({
    body:z.object({
        callId:z.string({
            required_error:"Call Id is required",
            invalid_type_error:"call Id must be a string"
        }),
        offer: offerSchema.refine(
            (data) => data.type === "offer",
            {
                message: "Session description type must be 'offer' for updating call"
            }
        ),
        registrationToken:z.string({
            invalid_type_error:"registration token must be a string"
        }).optional()
        
    })
})

export const acceptCallSchema=z.object({
    body:z.object({
        callId:z.string({
            required_error:"call Id is required",
            invalid_type_error:"call Id must be a string."
        }),
        answer:answerSchema.refine(
            (data) => data.type === "answer",
            {
                message: "Session description type must be 'answer' for updating call"
            }
        )
    })
})

export const rejectCallSchema=z.object({
    body:z.object({
        callId:z.string({
            required_error:"call Id is required",
            invalid_type_error:"call Id must be a string"
        })
    })
})

export const endCallSchema=z.object({
    body:z.object({
        callId:z.string({
            required_error:"call Id is required",
            invalid_type_error:"call Id must be a string"
        })
    })
})

export const sendIceCandidateSchema=z.object({
    body:z.object({
        profileId:z.string({
            required_error:"profile Id is required",
            invalid_type_error:"profile Id must be a string"
        }),
        callId:z.string({
            required_error:"call Id is required",
            invalid_type_error:"call Id must be a string"
        }),
        iceCandidate:iceCandidateSchema
    })
})