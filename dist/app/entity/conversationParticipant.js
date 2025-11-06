"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationParticipant = void 0;
const typeorm_1 = require("typeorm");
let ConversationParticipant = class ConversationParticipant {
};
exports.ConversationParticipant = ConversationParticipant;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "participantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], ConversationParticipant.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], ConversationParticipant.prototype, "deletedAt", void 0);
exports.ConversationParticipant = ConversationParticipant = __decorate([
    (0, typeorm_1.Entity)("conversationParticipant"),
    (0, typeorm_1.Index)("IDX_PARTICIPANT_CONVERSATION", ["participantId", "conversationId"]),
    (0, typeorm_1.Index)("IDX_PARTICIPANT_JOINEDAT_DELETEDAT", ["participantId", "joinedAt", "deletedAt"]),
    (0, typeorm_1.Index)("IDX_CONVERSATION", ["conversationId"])
], ConversationParticipant);
