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
exports.Online = void 0;
const typeorm_1 = require("typeorm");
const profile_1 = require("./profile");
const registrationEnum_1 = require("../modules/registration/enums/registrationEnum");
let Online = class Online {
};
exports.Online = Online;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Online.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: registrationEnum_1.onlineStatus, default: registrationEnum_1.onlineStatus.OFFLINE }),
    __metadata("design:type", String)
], Online.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Online.prototype, "lastSeen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", unique: true }),
    __metadata("design:type", String)
], Online.prototype, "profileId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profile_1.Profile, profile => profile.online, {
        onDelete: "CASCADE"
    }),
    (0, typeorm_1.JoinColumn)({ name: "profileId" }),
    __metadata("design:type", profile_1.Profile)
], Online.prototype, "profile", void 0);
exports.Online = Online = __decorate([
    (0, typeorm_1.Entity)("online"),
    (0, typeorm_1.Index)("IDX_ONLINE_PROFILEID", ["profileId"])
], Online);
