"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const call_proxy_1 = __importDefault(require("./call.proxy"));
const sendResponse_1 = __importDefault(require("../../middlewares/sendResponse"));
const controllerLogging_1 = require("../../utils/controllerLogging");
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
class callController {
    constructor() {
        // create a call
        this.createCall = (0, controllerLogging_1.controllerLogging)("callController.createCall", (0, catchAsyncError_1.default)(async (req, res) => {
            const { recipientId } = req.body;
            const result = await call_proxy_1.default.createCall(recipientId, req);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "calling created sucessfully",
                data: result
            });
        }));
        // update call
        this.updateCall = (0, controllerLogging_1.controllerLogging)("callController.updateCall", (0, catchAsyncError_1.default)(async (req, res) => {
            const { callId, offer, registrationToken } = req.body;
            await call_proxy_1.default.updateCall(callId, offer, registrationToken);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "ringing",
            });
        }));
        // accept call
        this.accecptCall = (0, controllerLogging_1.controllerLogging)("callController.acceptCall", (0, catchAsyncError_1.default)(async (req, res) => {
            const { callId, answer } = req.body;
            await call_proxy_1.default.acceptCall(callId, answer, req);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "call accepted",
            });
        }));
        this.rejectCall = (0, controllerLogging_1.controllerLogging)("callController.rejectCall", (0, catchAsyncError_1.default)(async (req, res) => {
            const { callId } = req.body;
            await call_proxy_1.default.rejectCall(callId, req);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "call rejected"
            });
        }));
        // end call
        this.endCall = (0, controllerLogging_1.controllerLogging)("callController.endCall", (0, catchAsyncError_1.default)(async (req, res) => {
            const { callId } = req.body;
            await call_proxy_1.default.endCall(callId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "call ended",
            });
        }));
        // send ice candidate
        this.sendIceCandidate = (0, controllerLogging_1.controllerLogging)("callController.sendIceCandidate", (0, catchAsyncError_1.default)(async (req, res) => {
            const { profileId, callId, candidate } = req.body;
            await call_proxy_1.default.sendIceCandidate(profileId, callId, candidate);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: 200,
                message: "ice candidate sent successfully"
            });
        }));
    }
}
exports.default = new callController;
