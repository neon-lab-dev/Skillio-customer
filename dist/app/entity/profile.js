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
exports.Profile = void 0;
const typeorm_1 = require("typeorm");
const baseEntity_1 = require("./baseEntity");
const registrationEnum_1 = require("../modules/registration/enums/registrationEnum");
const contact_1 = require("./contact");
const address_1 = require("./address");
const portfolio_1 = require("./portfolio");
const online_1 = require("./online");
let Profile = class Profile extends baseEntity_1.BaseEntity {
};
exports.Profile = Profile;
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "groupName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Profile.prototype, "pin", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Profile.prototype, "nickName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: registrationEnum_1.profileStatus, default: registrationEnum_1.profileStatus.REQUESTED }),
    __metadata("design:type", String)
], Profile.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: registrationEnum_1.ProfileType, default: registrationEnum_1.ProfileType.INDIVIDUAL }),
    __metadata("design:type", String)
], Profile.prototype, "profileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Profile.prototype, "isSubscribed", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contact_1.Contact, contact => contact.profile, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Profile.prototype, "contacts", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => address_1.Address, address => address.profile, {
        cascade: true,
    }),
    __metadata("design:type", address_1.Address)
], Profile.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => portfolio_1.Portfolio, portfolio => portfolio.profile, {
        cascade: true,
    }),
    __metadata("design:type", portfolio_1.Portfolio)
], Profile.prototype, "portfolio", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => online_1.Online, online => online.profile, {
        cascade: true,
    }),
    __metadata("design:type", online_1.Online)
], Profile.prototype, "online", void 0);
exports.Profile = Profile = __decorate([
    (0, typeorm_1.Entity)("profile"),
    (0, typeorm_1.Index)("IDX_NICKNAME_PIN", ["nickName", "pin"])
], Profile);
