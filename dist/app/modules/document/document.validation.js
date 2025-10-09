"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentsSchema = exports.updateDocumentSchema = exports.documentRequestSchema = void 0;
const zod_1 = require("zod");
const documentEnum_1 = require("./enums/documentEnum");
exports.documentRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        remarks: zod_1.z.string({
            invalid_type_error: "Remarks must be a string"
        }).optional().nullable(),
        type: zod_1.z.nativeEnum(documentEnum_1.DocumentType, {
            required_error: "Document type is required",
            invalid_type_error: "Invalid document type"
        }),
        profileId: zod_1.z.string({
            invalid_type_error: "Profile ID must be a string"
        }).optional().nullable()
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    }),
    file: zod_1.z.any({
        required_error: "File is required"
    })
}).refine((data) => {
    return !!data.file;
}, {
    message: " file is required."
});
exports.updateDocumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Document ID is required",
            invalid_type_error: "Document ID must be a string"
        }),
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    }),
    file: zod_1.z.any({
        required_error: "File is required"
    })
}).refine((data) => {
    return !!data.file;
}, {
    message: "file is required."
});
exports.deleteDocumentsSchema = zod_1.z.object({
    body: zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string({
            invalid_type_error: "Each ID must be a string"
        }), {
            required_error: "IDs are required",
            invalid_type_error: "IDs must be an array of strings"
        }).min(1, "at least 1 Id must be provided"),
        forceDelete: zod_1.z.boolean({
            required_error: "forceDelete is required",
            invalid_type_error: "forceDelete must be a boolean"
        })
    }, {
        required_error: "Request body is required",
        invalid_type_error: "Request body must be an object"
    }),
});
