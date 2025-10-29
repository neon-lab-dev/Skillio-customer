"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesDTO = exports.GetChatDTO = exports.ChaDTO = void 0;
class ChaDTO {
    constructor(data) {
        this.recipientId = data.recipientId;
        this.content = typeof data.content === 'string'
            ? JSON.parse(data.content)
            : data.content;
        this.fcmRegistrationToken = data.fcmRegistrationToken;
    }
    toJSON() {
        return {
            recipientId: this.recipientId,
            content: this.content,
            fcmRegistrationToken: this.fcmRegistrationToken
        };
    }
}
exports.ChaDTO = ChaDTO;
class GetChatDTO {
    constructor(data) {
        this.senderId = data.senderId;
        this.recipientId = data.recipientId;
        this.content = data.content;
        this.status = data.status;
        this.readAt = data.readAt;
    }
    toJSON() {
        return {
            senderId: this.senderId,
            recipientId: this.recipientId,
            content: this.content,
            status: this.status,
            readAt: this.readAt
        };
    }
}
exports.GetChatDTO = GetChatDTO;
class MessagesDTO {
    constructor(data) {
        this.recipientId = data.recipientId;
        this.before = typeof data.before === 'string' ? new Date(data.before) : data.before;
    }
    toJSON() {
        return {
            recipientId: this.recipientId,
            before: this.before
        };
    }
}
exports.MessagesDTO = MessagesDTO;
