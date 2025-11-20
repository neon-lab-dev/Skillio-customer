"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const callRepository_1 = __importDefault(require("../../repository/callRepository"));
const callEnum_1 = require("./enums/callEnum");
const callSocket_1 = require("./utils/callSocket");
const serviceLogging_1 = require("../../utils/serviceLogging");
const conversationParticipantRepository_1 = __importDefault(require("../../repository/conversationParticipantRepository"));
const checkIfConversationExists_1 = require("../chat/utils/checkIfConversationExists");
const conversationRepository_1 = __importDefault(require("../../repository/conversationRepository"));
const call_dto_1 = require("./call.dto");
class CallService {
    constructor() {
        // create a call
        this.createCall = (0, serviceLogging_1.serviceLogging)("callService", "createCall", async (recipientId, req) => {
            const callerId = req.user.profileId;
            const callerConversationIds = await conversationParticipantRepository_1.default.getAllConversationIdsByParticipantId(callerId);
            const recipientConversationIds = await conversationParticipantRepository_1.default.getAllConversationIdsByParticipantId(recipientId);
            const commonConversation = (0, checkIfConversationExists_1.hasSameId)(callerConversationIds, recipientConversationIds);
            let call;
            if (commonConversation?.flag) {
                const newCall = await callRepository_1.default.createCall({
                    callerId,
                    conversationId: commonConversation.id,
                    recipientId,
                    callStatus: callEnum_1.status.CALLING
                });
                call = new call_dto_1.GetCallDTO(newCall).toJSON();
            }
            else {
                const conversation = await conversationRepository_1.default.createConversation();
                await conversationParticipantRepository_1.default.createConversationParticipant({
                    conversationId: conversation.id,
                    participantId: callerId
                });
                await conversationParticipantRepository_1.default.createConversationParticipant({
                    conversationId: conversation.id,
                    participantId: recipientId
                });
                const newCall = await callRepository_1.default.createCall({
                    callerId,
                    conversationId: conversation.id,
                    recipientId,
                    callStatus: callEnum_1.status.CALLING
                });
                call = new call_dto_1.GetCallDTO(newCall).toJSON();
            }
            return call;
        });
        // update call with offer
        this.updateCall = (0, serviceLogging_1.serviceLogging)("callService", "updateCall", async (call, offer, registrationToken) => {
            (0, callSocket_1.startCall)(call.callerId, call.recipientId, call.id, offer, registrationToken || " ");
        });
        // accept call
        this.acceptCall = (0, serviceLogging_1.serviceLogging)("callService", "acceptCall", async (call, answer) => {
            await callRepository_1.default.updateCall(call.id, { answer, callStatus: callEnum_1.status.ACCEPTED });
            (0, callSocket_1.acceptCall)(call.callerId, call.id, answer);
        });
        // reject call
        this.rejectCall = (0, serviceLogging_1.serviceLogging)("callService", "rejectCall", async (call) => {
            await callRepository_1.default.updateCall(call.id, { callStatus: callEnum_1.status.REJECTED, endedAt: new Date() });
            (0, callSocket_1.rejectCall)(call.callerId, call.id);
        });
        // end call
        this.endCall = (0, serviceLogging_1.serviceLogging)("callService", "endCall", async (call) => {
            await callRepository_1.default.updateCall(call.id, {
                callStatus: callEnum_1.status.ENDED,
                endedAt: new Date()
            });
            [call.callerId, call.recipientId].forEach((userId) => {
                (0, callSocket_1.endCall)(userId, call.id);
            });
        });
        // send ice candidate
        this.sendIceCandidate = (0, serviceLogging_1.serviceLogging)("callService", "sendIceCandidate", async (profileId, callId, iceCandidate) => {
            (0, callSocket_1.sendIceCandidate)(profileId, callId, iceCandidate);
        });
    }
}
exports.default = new CallService;
