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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const notificationEnum_1 = require("../modules/notification/enums/notificationEnum");
const baseEntity_1 = require("./baseEntity");
let Notification = class Notification extends baseEntity_1.BaseEntity {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: notificationEnum_1.Medium }),
    __metadata("design:type", String)
], Notification.prototype, "medium", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "bodyText", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true, nullable: true }),
    __metadata("design:type", Array)
], Notification.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: notificationEnum_1.Status, default: notificationEnum_1.Status.IN_PROGRESS }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)("notification")
], Notification);
