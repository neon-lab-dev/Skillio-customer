import { z } from "zod";
import { DocumentType } from "./enums/documentEnum";
import { IS_MANDATORY_SCHEMA, IS_MANDATORY_STRING_ARRAY_SCHEMA, mandatoryTypeError, TYPE_VALIDATION_SCHEMA, typeError } from "@neon-lab-dev/platform";

const idSchema = IS_MANDATORY_SCHEMA("id");
const requestMandatoryError = mandatoryTypeError("request", "object");
const fileSchema = z.any();

export const documentRequestSchema = z.object({
  body: z.object({

    remarks: TYPE_VALIDATION_SCHEMA("remarks").optional().nullable(),

    type: z.nativeEnum(DocumentType, {
      error: typeError("type", "DocumentType")
    }),

    profileId: TYPE_VALIDATION_SCHEMA("profileId").optional().nullable()
  }, {
    error: mandatoryTypeError("request body", "object")
  }),
  file: fileSchema

}).refine((data) => {
  return !!data.file;
}, {
  message: " file is required."
});

export const getDocumentSchema = z.object({
  params: z.object({
    id: idSchema
  }, {
    error: requestMandatoryError
  })
});

export const updateDocumentSchema = z.object({
  body: z.object({
    id: idSchema,
  }, {
    error: requestMandatoryError
  }),
  file: fileSchema
}).refine((data) => {
  return !!data.file;
}, {
  message: "file is required."
});

export const deleteDocumentsSchema = z.object({
  body: z.object({
    ids: IS_MANDATORY_STRING_ARRAY_SCHEMA("ids"),

    forceDelete: z.boolean({
      error: typeError("forceDelete", "boolean")
    })
  }, {
    error: requestMandatoryError
  }),
})

export const fetchDocumentsSchema= z.object({
  portfolioId: IS_MANDATORY_SCHEMA("portfolioId")
}).strict()