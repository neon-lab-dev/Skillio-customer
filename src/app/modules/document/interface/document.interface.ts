import { DocumentType , DocumentStatus } from "../enums/documentEnum";

export interface TDocument {
  fileName: string;
  url: string;
  mimeType: string;
  remarks?: string;
  type: DocumentType;
  status: DocumentStatus;
  portfolioId?: string;
};


export interface TDocumentConfig{
  maxFileSize: number;
}