"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const proxyLogging_1 = require("../../utils/proxyLogging");
const call_service_1 = __importDefault(require("./call.service"));
const callRepository_1 = __importDefault(require("../../repository/callRepository"));
const logger_1 = __importDefault(require("../../utils/logger"));
const appError_1 = __importDefault(require("../../errors/appError"));
const registrationRepository_1 = __importDefault(require("../../repository/registrationRepository"));
const callEnum_1 = require("./enums/callEnum");
class CallProxy {
    constructor() {
        this.checkExistingCall = async (id) => {
            const existingCall = await callRepository_1.default.findById(id);
            if (!existingCall) {
                logger_1.default.error("call not found");
                throw new appError_1.default(404, "call not found");
            }
            return existingCall;
        };
        this.checkExistingProfile = async (profileId) => {
            const existingProfile = await registrationRepository_1.default.findProfileById(profileId);
            if (!existingProfile) {
                logger_1.default.error("profile not found");
                throw new appError_1.default(404, "profile not found");
            }
            return;
        };
        // create a call
        this.createCall = (0, proxyLogging_1.proxyLogging)("callProxy", "createCall", async (recipientId, req) => {
            await this.checkExistingProfile(recipientId);
            return await call_service_1.default.createCall(recipientId, req);
        });
        // update a call with offer
        this.updateCall = (0, proxyLogging_1.proxyLogging)("callProxy", "updateCall", async (callId, offer, registrationToken) => {
            const call = await this.checkExistingCall(callId);
            if (call.callStatus != callEnum_1.status.CALLING) {
                logger_1.default.error("cannot update call");
                throw new appError_1.default(409, "cannot update call");
            }
            return await call_service_1.default.updateCall(call, offer, registrationToken);
        });
        // accept call
        this.acceptCall = (0, proxyLogging_1.proxyLogging)("callProxy", "acceptCall", async (callId, answer, req) => {
            const call = await this.checkExistingCall(callId);
            if (call.callStatus != callEnum_1.status.RINGING) {
                logger_1.default.error("cannot accept call ");
                throw new appError_1.default(409, "cannot accept call");
            }
            const recipientId = req.user.profileId;
            if (call.recipientId != recipientId) {
                logger_1.default.error("unauthorized access");
                throw new appError_1.default(409, "unauthorized access");
            }
            return await call_service_1.default.acceptCall(call, answer);
        });
        // reject call
        this.rejectCall = (0, proxyLogging_1.proxyLogging)("callProxy", "rejectCall", async (callId, req) => {
            const call = await this.checkExistingCall(callId);
            if (call.callStatus != callEnum_1.status.RINGING) {
                logger_1.default.error("can not reject call");
                throw new appError_1.default(409, "can not reject call");
            }
            const recipientId = req.user.profileId;
            if (recipientId != call.recipientId) {
                logger_1.default.error("unauthorized access");
                throw new appError_1.default(409, "unauthorized access");
            }
            return await call_service_1.default.rejectCall(call);
        });
        // end call
        this.endCall = (0, proxyLogging_1.proxyLogging)("callProxy", "endCall", async (callId) => {
            const call = await this.checkExistingCall(callId);
            if (call.callStatus != callEnum_1.status.ACCEPTED) {
                logger_1.default.error("can not end call");
                throw new appError_1.default(409, "can not end call");
            }
            return await call_service_1.default.endCall(call);
        });
        // send Ice candidate
        this.sendIceCandidate = (0, proxyLogging_1.proxyLogging)("callProxy", "sendIceCandidate", async (profileId, callId, iceCandidate) => {
            await this.checkExistingCall(callId);
            await this.checkExistingProfile(profileId);
            return await call_service_1.default.sendIceCandidate(profileId, callId, iceCandidate);
        });
    }
}
exports.default = new CallProxy;
