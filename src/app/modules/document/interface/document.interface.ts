import { DocumentType , DocumentStatus } from "../enums/documentEnum";

export interface TDocument {
  fileName: string;
  url: string;
  mimeType: string;
  remarks?: string;
  type: DocumentType;
  status: DocumentStatus;
  profileId?: string;
  portfolioVideoId?: string;
  portfolioImageId?: string;
  portfolioEventsDoneId?: string;
};


export interface TDocumentConfig{
  maxFileSize: number;
}