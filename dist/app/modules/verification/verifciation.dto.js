"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationDTO = void 0;
// dto to create a verification request
class VerificationDTO {
    constructor(data) {
        this.phoneNumber = data.phoneNumber;
        this.purpose = data.purpose;
    }
    toJSON() {
        return {
            phoneNumber: this.phoneNumber,
            purpose: this.purpose
        };
    }
}
exports.VerificationDTO = VerificationDTO;
