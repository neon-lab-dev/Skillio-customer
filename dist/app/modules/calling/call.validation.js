"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendIceCandidateSchema = exports.endCallSchema = exports.rejectCallSchema = exports.acceptCallSchema = exports.updateCallSchema = exports.createCallSchema = void 0;
const zod_1 = require("zod");
const offerSchema = zod_1.z.object({
    type: zod_1.z.enum(["offer"], {
        required_error: "offer type is required",
        invalid_type_error: "Type must be 'offer'"
    }),
    sdp: zod_1.z.string({
        required_error: "SDP is required",
        invalid_type_error: "SDP must be a string"
    }).min(1, "SDP cannot be empty")
}, {
    required_error: "offer is required",
    invalid_type_error: "offer must be an object"
});
const answerSchema = zod_1.z.object({
    type: zod_1.z.enum(["answer"], {
        required_error: "answer type is required",
        invalid_type_error: "Type must be 'answer'"
    }),
    sdp: zod_1.z.string({
        required_error: "SDP is required",
        invalid_type_error: "SDP must be a string"
    }).min(1, "SDP cannot be empty")
}, {
    required_error: "answer is required",
    invalid_type_error: "answer must be an object"
});
const iceCandidateSchema = zod_1.z.object({
    candidate: zod_1.z.string({
        required_error: "Candidate string is required",
        invalid_type_error: "Candidate must be a string"
    }).min(1, "Candidate cannot be empty"),
    sdpMid: zod_1.z.string().nullable().optional(),
    sdpMLineIndex: zod_1.z.number({
        invalid_type_error: "sdpMLineIndex must be a number"
    }).int("sdpMLineIndex must be an integer")
        .nullable()
        .optional(),
    usernameFragment: zod_1.z.string().nullable().optional()
});
exports.createCallSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipientId: zod_1.z.string({
            required_error: "Recipient Id is required",
            invalid_type_error: "Recipient Id must be a string"
        })
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    })
});
exports.updateCallSchema = zod_1.z.object({
    body: zod_1.z.object({
        callId: zod_1.z.string({
            required_error: "Call Id is required",
            invalid_type_error: "call Id must be a string"
        }),
        offer: offerSchema.refine((data) => data.type === "offer", {
            message: "Session description type must be 'offer' for updating call"
        }),
        registrationToken: zod_1.z.string({
            invalid_type_error: "registration token must be a string"
        }).optional()
    })
});
exports.acceptCallSchema = zod_1.z.object({
    body: zod_1.z.object({
        callId: zod_1.z.string({
            required_error: "call Id is required",
            invalid_type_error: "call Id must be a string."
        }),
        answer: answerSchema.refine((data) => data.type === "answer", {
            message: "Session description type must be 'answer' for updating call"
        })
    })
});
exports.rejectCallSchema = zod_1.z.object({
    body: zod_1.z.object({
        callId: zod_1.z.string({
            required_error: "call Id is required",
            invalid_type_error: "call Id must be a string"
        })
    })
});
exports.endCallSchema = zod_1.z.object({
    body: zod_1.z.object({
        callId: zod_1.z.string({
            required_error: "call Id is required",
            invalid_type_error: "call Id must be a string"
        })
    })
});
exports.sendIceCandidateSchema = zod_1.z.object({
    body: zod_1.z.object({
        profileId: zod_1.z.string({
            required_error: "profile Id is required",
            invalid_type_error: "profile Id must be a string"
        }),
        callId: zod_1.z.string({
            required_error: "call Id is required",
            invalid_type_error: "call Id must be a string"
        }),
        iceCandidate: iceCandidateSchema
    })
});
