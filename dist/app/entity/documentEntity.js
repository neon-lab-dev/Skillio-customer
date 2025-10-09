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
exports.Document = void 0;
const typeorm_1 = require("typeorm");
const baseEntity_1 = require("./baseEntity");
const documentEnum_1 = require("../modules/document/enums/documentEnum");
const profile_1 = require("./profile");
const portfolio_1 = require("./portfolio");
let Document = class Document extends baseEntity_1.BaseEntity {
};
exports.Document = Document;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: documentEnum_1.DocumentType }),
    __metadata("design:type", String)
], Document.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: documentEnum_1.DocumentStatus }),
    __metadata("design:type", String)
], Document.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "uuid" }),
    __metadata("design:type", String)
], Document.prototype, "profileId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profile_1.Profile, profile => profile.profilePhoto, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "profileId" }),
    __metadata("design:type", profile_1.Profile)
], Document.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "uuid" }),
    __metadata("design:type", String)
], Document.prototype, "portfolioVideoId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => portfolio_1.Portfolio, portfolio => portfolio.video, {
        nullable: true,
        onDelete: "CASCADE"
    }),
    (0, typeorm_1.JoinColumn)({ name: "portfolioVideoId" }),
    __metadata("design:type", portfolio_1.Portfolio)
], Document.prototype, "portfolioVideo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "uuid" }),
    __metadata("design:type", String)
], Document.prototype, "portfolioImageId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => portfolio_1.Portfolio, portfolio => portfolio.image, {
        nullable: true,
        onDelete: "CASCADE"
    }),
    (0, typeorm_1.JoinColumn)({ name: "portfolioImageId" }),
    __metadata("design:type", portfolio_1.Portfolio)
], Document.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "uuid" }),
    __metadata("design:type", String)
], Document.prototype, "portfolioEventsDoneId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => portfolio_1.Portfolio, portfolio => portfolio.eventsDone, {
        nullable: true,
        onDelete: "CASCADE"
    }),
    (0, typeorm_1.JoinColumn)({ name: "portfolioEventsDoneId" }),
    __metadata("design:type", portfolio_1.Portfolio)
], Document.prototype, "eventsDone", void 0);
exports.Document = Document = __decorate([
    (0, typeorm_1.Entity)("document"),
    (0, typeorm_1.Index)("IDX_TYPE_STATUS", ["type", "status"]),
    (0, typeorm_1.Index)("IDX_ID_TYPE_STATUS", ["id", "type", "status"])
], Document);
