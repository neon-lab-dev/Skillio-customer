import { z } from "zod";
import { DocumentType } from "./enums/documentEnum";

export const documentRequestSchema = z.object({
  body: z.object({

    remarks: z.string({
      invalid_type_error: "Remarks must be a string"
    }).optional().nullable(),

    type: z.nativeEnum(DocumentType, {
      required_error: "Document type is required",
      invalid_type_error: "Invalid document type"
    }),

    profileId: z.string({
      invalid_type_error: "Profile ID must be a string"
    }).optional().nullable()
  }, {
    required_error: "Request body is required",
    invalid_type_error: "Request body must be an object"
  }),
    file: z.any({
    required_error: "File is required"
  })

}).refine((data)=>{
  return !!data.file;
} , {
  message: "At least one file is required."
});


export const updateDocumentSchema = z.object({
  file: z.any({
    required_error: "File is required"
  })
}).refine((data)=>{
  return !!data.file;
},{
  message: "At least one file is required."
});

export const deleteDocumentSchema = z.object({
  body: z.object({
    forceDelete: z.boolean({
      required_error: "forceDelete is required",
      invalid_type_error: "forceDelete must be a boolean"
    })
  }, {
    required_error: "Request body is required",
    invalid_type_error: "Request body must be an object"
  })
})