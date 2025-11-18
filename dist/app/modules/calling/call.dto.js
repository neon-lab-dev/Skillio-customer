"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCallDTO = void 0;
class GetCallDTO {
    constructor(data) {
        this.id = data.id;
        this.callerId = data.callerId;
        this.recipientId = data.recipientId;
        this.callStatus = data.callStatus;
        this.startedAt = data.startedAt;
        this.endedAt = data.endedAt;
    }
    toJSON() {
        return {
            id: this.id,
            callerId: this.callerId,
            recipientId: this.recipientId,
            callStatus: this.callStatus,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
        };
    }
}
exports.GetCallDTO = GetCallDTO;
