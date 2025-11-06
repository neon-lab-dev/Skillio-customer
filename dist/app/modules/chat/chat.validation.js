"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationsSchema = exports.getMessagesSchema = exports.sendMessageSchema = void 0;
const zod_1 = require("zod");
exports.sendMessageSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipientId: zod_1.z.string({
            required_error: "Recipient ID is required",
            invalid_type_error: "Recipient ID must be a string"
        }),
        content: zod_1.z.preprocess((val) => {
            if (typeof val === "string") {
                try {
                    return JSON.parse(val);
                }
                catch {
                    return undefined;
                }
            }
            return val;
        }, zod_1.z.object({
            text: zod_1.z
                .preprocess((val) => {
                if (val === null || val === undefined)
                    return undefined;
                return String(val);
            }, zod_1.z.string().optional()),
            postId: zod_1.z
                .string({
                invalid_type_error: "Post ID must be a string",
            })
                .optional(),
            fileUrl: zod_1.z.string().optional(),
        }).optional()),
        fcmRegistrationToken: zod_1.z.string({
            invalid_type_error: "FCM Registration Token must be a string"
        }).optional()
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    }),
    file: zod_1.z.any({
        invalid_type_error: "File must be a valid file"
    }).optional()
}).refine((data) => {
    const hasText = data.body.content?.text && data.body.content.text.trim() !== "";
    const hasPostId = !!data.body.content?.postId;
    const hasFile = !!data.file;
    return hasText || hasPostId || hasFile;
}, {
    message: "Either content (text or postId) or file must be provided",
    path: ["body"]
});
exports.getMessagesSchema = zod_1.z.object({
    query: zod_1.z.object({
        conversationId: zod_1.z.string({
            required_error: "Conversation ID is required",
            invalid_type_error: "Conversation ID must be a string"
        }),
        limit: zod_1.z.string({
            invalid_type_error: "Limit must be a string"
        }).optional(),
        before: zod_1.z.preprocess((val) => {
            if (val instanceof Date)
                return val;
            if (typeof val === "string") {
                const date = new Date(val);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        }, zod_1.z.date({
            invalid_type_error: "Before must be a valid date"
        })).optional()
    })
});
exports.getConversationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string({
            invalid_type_error: "Page must be a string"
        }).optional(),
        limit: zod_1.z.string({
            invalid_type_error: "Limit must be a string"
        }).optional()
    })
});
