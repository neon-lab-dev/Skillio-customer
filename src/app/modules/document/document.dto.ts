import { DocumentType  } from "./enums/documentEnum";

export class DocumentDTO {
  remarks?: string;
  type: DocumentType;
  profileId?: string;

  constructor(data: {
    remarks?: string;
    type: DocumentType;
  }) {
    this.remarks = data.remarks;
    this.type = data.type;
  }

  toJSON(): {
    remarks?: string;
    type: DocumentType;
    profileId?: string;
  } {
    return {
      remarks: this.remarks,
      type: this.type,
      profileId: this.profileId
    };
  }
}
