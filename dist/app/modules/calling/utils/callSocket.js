"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endCall = exports.rejectCall = exports.sendIceCandidate = exports.acceptCall = exports.startCall = void 0;
const callRepository_1 = __importDefault(require("../../../repository/callRepository"));
const logger_1 = __importDefault(require("../../../utils/logger"));
const pushNotification_1 = require("../../../utils/pushNotification");
const sockets_1 = require("../../../utils/sockets");
const callEnum_1 = require("../enums/callEnum");
const startCall = async (callerId, recipientId, callId, offer, registrationToken) => {
    const io = (0, sockets_1.getIO)();
    const socketId = sockets_1.onlineUsers.get(recipientId);
    if (socketId) {
        io.to(socketId).emit("incomingCall", {
            callerId,
            recipientId,
            callId,
            offer
        });
        await callRepository_1.default.updateCall(callId, { offer, callStatus: callEnum_1.status.RINGING });
        logger_1.default.info(`calling reciever:${recipientId}`);
    }
    else {
        (0, pushNotification_1.sendSinglePushNotification)(callerId, {
            text: "you have recieved a call"
        }, "call", registrationToken);
    }
};
exports.startCall = startCall;
const acceptCall = (callerId, callId, answer) => {
    const io = (0, sockets_1.getIO)();
    const socketId = sockets_1.onlineUsers.get(callerId);
    if (socketId) {
        io.to(socketId).emit("answer", {
            callId,
            answer
        });
        logger_1.default.info(`answering call: ${callId}`);
    }
};
exports.acceptCall = acceptCall;
const sendIceCandidate = (userId, callId, iceCandidate) => {
    const io = (0, sockets_1.getIO)();
    const socketId = sockets_1.onlineUsers.get(userId);
    if (socketId) {
        io.to(socketId).emit("iceCandidate", {
            callId,
            iceCandidate
        });
    }
};
exports.sendIceCandidate = sendIceCandidate;
const rejectCall = (callerId, callId) => {
    const io = (0, sockets_1.getIO)();
    const socketId = sockets_1.onlineUsers.get(callerId);
    if (socketId) {
        io.to(socketId).emit("callRejected", {
            callId,
            callRejected: true
        });
    }
};
exports.rejectCall = rejectCall;
const endCall = (userId, callId) => {
    const io = (0, sockets_1.getIO)();
    const socketId = sockets_1.onlineUsers.get(userId);
    if (socketId) {
        io.to(socketId).emit("endCall", {
            callId,
            callEnded: true
        });
    }
};
exports.endCall = endCall;
