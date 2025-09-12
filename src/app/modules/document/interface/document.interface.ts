import { DocumentType , DocumentStatus } from "../enums/documentEnum";

export interface TDocument {
  fileName: string;
  url: string;
  mimeType: string;
  remarks?: string;
  type: DocumentType;
  status: DocumentStatus;
  profileId?: string;
};
