"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    if (!res || typeof res.status !== "function") {
        throw new Error("Invalid Response object passed to sendResponse");
    }
    res.status(data.statusCode ?? 200).json({
        success: data.success,
        message: data.message,
        data: data.data
    });
};
exports.default = sendResponse;
