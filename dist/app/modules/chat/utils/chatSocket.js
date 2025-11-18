"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const chatRepository_1 = __importDefault(require("../../../repository/chatRepository"));
const logger_1 = __importDefault(require("../../../utils/logger"));
const pushNotification_1 = require("../../../utils/pushNotification");
const sockets_1 = require("../../../utils/sockets");
const chatEnum_1 = require("../enums/chatEnum");
const sendMessage = async (id, senderId, recipientId, content, registrationToken) => {
    const io = (0, sockets_1.getIO)();
    const socketId = sockets_1.onlineUsers.get(recipientId);
    if (socketId) {
        io.to(socketId).emit("message", content);
        await chatRepository_1.default.updateMessageById(id, {
            status: chatEnum_1.Status.DELIVERED
        });
        logger_1.default.info(`Message sent to recipientId: ${recipientId}, socketId: ${socketId}`);
    }
    else {
        (0, pushNotification_1.sendSinglePushNotification)(senderId, content, "message", registrationToken);
    }
};
exports.sendMessage = sendMessage;
