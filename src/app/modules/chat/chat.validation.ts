import {z} from "zod";

export const sendMessageSchema= z.object({
    body: z.object({
        recipientId: z.string({
            required_error: "Recipient ID is required",
            invalid_type_error: "Recipient ID must be a string"
        }),
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
          postId: z
            .string({
              invalid_type_error: "Post ID must be a string",
            })
            .optional(),
          fileUrl: z.string().optional(),
        }).optional()
    ),
        fcmRegistrationToken: z.string({
            invalid_type_error: "FCM Registration Token must be a string"
        }).optional()
    } , {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    }),
    file:z.any({
        invalid_type_error: "File must be a valid file"
    }).optional()
}).refine(
    (data)=>{
        const hasText= data.body.content?.text && data.body.content.text.trim() !== "";
        const hasPostId= !!data.body.content?.postId;
        const hasFile= !!data.file;

        return hasText || hasPostId || hasFile;
    },{
        message: "Either content (text or postId) or file must be provided",
        path: ["body"]
    }
)

export const getMessagesSchema= z.object({
    body: z.object({
        recipientId: z.string({
            required_error: "Recipient ID is required",
            invalid_type_error: "Recipient ID must be a string"
        }),
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
        required_error: "Before date is required",
        invalid_type_error: "Before must be a valid date"
      })
    )
    }),
    query: z.object({
        limit: z.string({
            required_error: "Limit is required",
            invalid_type_error: "Limit must be a string"
        })
    })
})