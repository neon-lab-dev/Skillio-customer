"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const validateRequest = (schema) => {
    return (0, catchAsyncError_1.default)(async (req, res, next) => {
        await schema.parse({
            body: req.body,
            cookies: req.cookies,
        });
        return next();
    });
};
exports.default = validateRequest;
