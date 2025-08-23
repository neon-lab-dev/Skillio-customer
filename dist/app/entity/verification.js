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
exports.Verification = exports.verificationPurpose = exports.OtpCodeStatus = void 0;
const typeorm_1 = require("typeorm");
var OtpCodeStatus;
(function (OtpCodeStatus) {
    OtpCodeStatus[OtpCodeStatus["SENT"] = 0] = "SENT";
    OtpCodeStatus[OtpCodeStatus["VERIFIED"] = 1] = "VERIFIED";
    OtpCodeStatus[OtpCodeStatus["EXPIRED"] = 2] = "EXPIRED";
})(OtpCodeStatus || (exports.OtpCodeStatus = OtpCodeStatus = {}));
var verificationPurpose;
(function (verificationPurpose) {
    verificationPurpose[verificationPurpose["LOGIN"] = 0] = "LOGIN";
    verificationPurpose[verificationPurpose["PHONE_VERIFICATION"] = 1] = "PHONE_VERIFICATION";
    verificationPurpose[verificationPurpose["EMAIL_VERIFICATION"] = 2] = "EMAIL_VERIFICATION";
    verificationPurpose[verificationPurpose["SIGNUP"] = 3] = "SIGNUP";
})(verificationPurpose || (exports.verificationPurpose = verificationPurpose = {}));
let Verification = class Verification {
    setCreatedAt() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    setUpdatedAt() {
        this.updatedAt = new Date();
    }
};
exports.Verification = Verification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Verification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Verification.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
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
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Verification.prototype, "otpCodeStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Verification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Verification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Verification.prototype, "setCreatedAt", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Verification.prototype, "setUpdatedAt", null);
exports.Verification = Verification = __decorate([
    (0, typeorm_1.Entity)("verification")
], Verification);
