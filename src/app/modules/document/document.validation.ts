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
  message: " file is required."
});


export const updateDocumentSchema = z.object({
  body: z.object({
  },{
    required_error: "Request body is required",
    invalid_type_error: "Request body must be an object"
  }),
  file: z.any({
    required_error: "File is required"
  })
}).refine((data)=>{
  return !!data.file;
},{
  message: "file is required."
});

export const deleteDocumentSchema = z.object({
  query: z.object({
    forceDelete: z.string({
      required_error: "forceDelete query is required",
      invalid_type_error: "forceDelete query must be a string"
    })
  }, {
    required_error: "query is required",
    invalid_type_error: "query must be an string"
  })
})