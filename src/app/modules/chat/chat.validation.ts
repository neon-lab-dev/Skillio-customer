import { IS_MANDATORY_SCHEMA, mandatoryTypeError, TYPE_VALIDATION_SCHEMA, typeError } from "@neon-lab-dev/platform";
import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    recipientId: IS_MANDATORY_SCHEMA("Recipient Id"),
    content: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
      z.object({
        text: z
          .preprocess(
            (val) => {
              if (val === null || val === undefined) return undefined;
              return String(val);
            },
            z.string().optional()
          ),
        postId: TYPE_VALIDATION_SCHEMA("Post Id")
          .optional(),
        fileUrl: z.string().optional(),
      }).optional()
    ),
    fcmRegistrationToken: TYPE_VALIDATION_SCHEMA("FCM Registration Token").optional()
  }, {
    error: mandatoryTypeError("request body", "object")
  }),
  file: z.file({
    error: typeError("file", "file")
  }
  ).optional()
}).refine(
  (data) => {
    const hasText = data.body.content?.text && data.body.content.text.trim() !== "";
    const hasPostId = !!data.body.content?.postId;
    const hasFile = !!data.file;

    return hasText || hasPostId || hasFile;
  }, {
  message: "Either content (text or postId) or file must be provided",
  path: ["body"]
}
)

export const getMessagesSchema = z.object({
  query: z.object({
    conversationId: IS_MANDATORY_SCHEMA("conversationId"),
    limit: TYPE_VALIDATION_SCHEMA("limit").optional(),
    before: z.preprocess(
      (val) => {
        if (val instanceof Date) return val;

        if (typeof val === "string") {
          const date = new Date(val);
          return isNaN(date.getTime()) ? undefined : date;
        }

        return undefined;
      },
      z.date({
        error: typeError("before", "date")
      }),
    ).optional()
  })
})

export const getConversationsSchema = z.object({
  query: z.object({
    page: TYPE_VALIDATION_SCHEMA("page")
      .optional(),

    limit: TYPE_VALIDATION_SCHEMA("limit")
      .optional()
  })
})