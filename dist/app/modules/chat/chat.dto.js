"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChatDTO = exports.ChaDTO = void 0;
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
        this.id = data.id;
        this.senderId = data.senderId;
        this.recipientId = data.recipientId;
        this.content = data.content;
        this.status = data.status;
        this.readAt = data.readAt;
        this.isDeleted = data.isDeleted;
        this.createdAt = data.createdAt;
    }
    toJSON() {
        return {
            id: this.id,
            senderId: this.senderId,
            recipientId: this.recipientId,
            content: this.content,
            status: this.status,
            readAt: this.readAt,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt
        };
    }
}
exports.GetChatDTO = GetChatDTO;
