// dtos/verification.dto.ts
import { verificationPurpose } from "../../entity/verification";

export class VerificationDTO {
  phoneNumber: string;
  purpose: verificationPurpose;

  constructor(data: {
    phoneNumber: string;
    purpose: verificationPurpose;
  }) {
    this.phoneNumber = data.phoneNumber;
    this.purpose = data.purpose;
  }

  toJSON(): {
    phoneNumber: string;
    purpose: verificationPurpose;
  } {
    return {
      phoneNumber: this.phoneNumber,
      purpose: this.purpose
    };
  }
}