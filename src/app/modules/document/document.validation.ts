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

export const getDocumentSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Document ID is required",
      invalid_type_error: "Document ID must be a string"
    })
  } , {
    required_error: "Request params are required",
    invalid_type_error: "Request params must be an object"
  })
});

export const updateDocumentSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "Document ID is required",
      invalid_type_error: "Document ID must be a string"
    }),
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

export const deleteDocumentsSchema = z.object({
  body: z.object({
    ids: z.array(z.string({
      invalid_type_error: "Each ID must be a string"
    }), {
      required_error: "IDs are required",
      invalid_type_error: "IDs must be an array of strings"
    }).min(1, "at least 1 Id must be provided"),

    forceDelete: z.boolean({
      required_error: "forceDelete is required",
      invalid_type_error: "forceDelete must be a boolean"
    })
  }, {
    required_error: "Request body is required",
    invalid_type_error: "Request body must be an object"
  }),
})