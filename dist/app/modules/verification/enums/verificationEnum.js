"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationPurpose = exports.OtpCodeStatus = void 0;
var OtpCodeStatus;
(function (OtpCodeStatus) {
    OtpCodeStatus["SENT"] = "SENT";
    OtpCodeStatus["VERIFIED"] = "VERIFIED";
    OtpCodeStatus["EXPIRED"] = "EXPIRED";
    OtpCodeStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(OtpCodeStatus || (exports.OtpCodeStatus = OtpCodeStatus = {}));
var verificationPurpose;
(function (verificationPurpose) {
    verificationPurpose["LOGIN"] = "LOGIN";
    verificationPurpose["PHONE_VERIFICATION"] = "PHONE_VERIFICATION";
    verificationPurpose["EMAIL_VERIFICATION"] = "EMAIL_VERIFICATION";
    verificationPurpose["SIGNUP"] = "SIGNUP";
})(verificationPurpose || (exports.verificationPurpose = verificationPurpose = {}));
