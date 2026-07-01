export interface SampleDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  uploadedBy: string;
  status: "Verified" | "Pending Review" | "Missing" | "AI Extracted";
  aiConfidence: number;
}

export const sampleDocuments: SampleDocument[] = [
  {
    id: "doc-001",
    documentType: "Invoice",
    fileName: "Invoice_2026_001.pdf",
    fileSize: "245 KB",
    uploadedDate: "2026-06-28",
    uploadedBy: "Aisha Khan",
    status: "Verified",
    aiConfidence: 98,
  },
  {
    id: "doc-002",
    documentType: "KYC Documents",
    fileName: "KYC_Documents.zip",
    fileSize: "3.2 MB",
    uploadedDate: "2026-06-29",
    uploadedBy: "Mina Haddad",
    status: "Pending Review",
    aiConfidence: 76,
  },
  {
    id: "doc-003",
    documentType: "Board Resolution",
    fileName: "Board_Resolution.pdf",
    fileSize: "512 KB",
    uploadedDate: "2026-06-30",
    uploadedBy: "Legal Team",
    status: "Missing",
    aiConfidence: 0,
  },
  {
    id: "doc-004",
    documentType: "Credit Summary",
    fileName: "Credit_Summary.docx",
    fileSize: "180 KB",
    uploadedDate: "2026-06-30",
    uploadedBy: "AI Extractor",
    status: "AI Extracted",
    aiConfidence: 92,
  },
];
