"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const zodError_1 = __importDefault(require("../errors/zodError"));
const appError_1 = __importDefault(require("../errors/appError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSourse = [{
            path: '',
            message: 'Something went wrong!'
        }];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, zodError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSourse = simplifiedError?.errorSources;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err?.statusCode;
        message = err?.message;
        errorSourse = [{
                path: "",
                message: err?.message
            }];
    }
    else if (err instanceof Error) {
        message = err?.message;
        errorSourse = [{
                path: "",
                message: err?.message
            }];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSourse,
    });
    return;
};
exports.default = globalErrorHandler;
