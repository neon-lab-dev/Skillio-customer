"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationDTO = void 0;
class notificationDTO {
    constructor(data) {
        this.medium = data.medium;
        this.to = data.to;
        this.bodyText = data.bodyText;
        this.attachments = data.attachments;
        this.status = data.status;
    }
    toJSON() {
        return {
            medium: this.medium,
            to: this.to,
            bodyText: this.bodyText,
            attachments: this.attachments,
            status: this.status
        };
    }
}
exports.notificationDTO = notificationDTO;
