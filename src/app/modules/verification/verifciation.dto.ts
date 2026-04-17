
// dto to create a verification request
export class VerificationDTO {
  phoneNumber: string;

  constructor(data: {
    phoneNumber: string;
  }) {
    this.phoneNumber = data.phoneNumber;
  }

  toJSON(): {
    phoneNumber: string;
  } {
    return {
      phoneNumber: this.phoneNumber,
    };
  }
}