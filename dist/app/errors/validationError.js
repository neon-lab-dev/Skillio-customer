"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const statusCode = 400;
    const errorSources = Object.values(err.errors).map((val) => {
        return {
            path: val?.path,
            message: val?.message
        };
    });
    return {
        statusCode,
        message: "Zod Validation Error.",
        errorSources,
    };
};
exports.default = handleValidationError;
