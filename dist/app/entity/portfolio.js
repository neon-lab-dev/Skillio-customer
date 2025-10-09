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
exports.Portfolio = void 0;
const typeorm_1 = require("typeorm");
const baseEntity_1 = require("./baseEntity");
const registrationEnum_1 = require("../modules/registration/enums/registrationEnum");
const profile_1 = require("./profile");
const documentEntity_1 = require("./documentEntity");
let Portfolio = class Portfolio extends baseEntity_1.BaseEntity {
};
exports.Portfolio = Portfolio;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Portfolio.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Portfolio.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: registrationEnum_1.proficiecy }),
    __metadata("design:type", String)
], Portfolio.prototype, "proficiency", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Portfolio.prototype, "totalEvents", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Portfolio.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => documentEntity_1.Document),
    __metadata("design:type", documentEntity_1.Document)
], Portfolio.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => documentEntity_1.Document),
    __metadata("design:type", documentEntity_1.Document)
], Portfolio.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => documentEntity_1.Document, { nullable: true }),
    __metadata("design:type", documentEntity_1.Document)
], Portfolio.prototype, "eventsDone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Portfolio.prototype, "profileId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profile_1.Profile, profile => profile.portfolio),
    (0, typeorm_1.JoinColumn)({ name: "profileId" }),
    __metadata("design:type", profile_1.Profile)
], Portfolio.prototype, "profile", void 0);
exports.Portfolio = Portfolio = __decorate([
    (0, typeorm_1.Entity)("portfolio")
], Portfolio);
