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
exports.Verification = void 0;
const typeorm_1 = require("typeorm");
const verificationEnum_1 = require("../modules/verification/enums/verificationEnum");
const verificationEnum_2 = require("../modules/verification/enums/verificationEnum");
const baseEntity_1 = require("./baseEntity");
let Verification = class Verification extends baseEntity_1.BaseEntity {
};
exports.Verification = Verification;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Verification.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: verificationEnum_2.verificationPurpose }),
    __metadata("design:type", String)
], Verification.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Verification.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Verification.prototype, "expirationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: verificationEnum_1.OtpCodeStatus }),
    __metadata("design:type", String)
], Verification.prototype, "otpCodeStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Verification.prototype, "attempts", void 0);
exports.Verification = Verification = __decorate([
    (0, typeorm_1.Entity)("verification")
], Verification);
