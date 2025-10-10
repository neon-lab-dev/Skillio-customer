"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileStatus = exports.proficiecy = exports.contactType = exports.ProfileType = void 0;
var ProfileType;
(function (ProfileType) {
    ProfileType["INDIVIDUAL"] = "INDIVIDUAL";
    ProfileType["GROUP"] = "GROUP";
})(ProfileType || (exports.ProfileType = ProfileType = {}));
var contactType;
(function (contactType) {
    contactType["PHONE"] = "PHONE";
    contactType["EMAIL"] = "EMAIL";
})(contactType || (exports.contactType = contactType = {}));
var proficiecy;
(function (proficiecy) {
    proficiecy["PROFESSIONAL"] = "PROFESSIONAL";
    proficiecy["SKILLED"] = "SKILLED";
})(proficiecy || (exports.proficiecy = proficiecy = {}));
var profileStatus;
(function (profileStatus) {
    profileStatus["CREATED"] = "CREATED";
    profileStatus["REQUESTED"] = "REQUESTED";
})(profileStatus || (exports.profileStatus = profileStatus = {}));
