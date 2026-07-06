import type { DealModel } from '@/atlas-core/deals/DealModel';

export type EvidenceCategoryName =
  | 'Corporate Documents'
  | 'KYC'
  | 'Financial Statements'
  | 'Trade Documents'
  | 'Receivables'
  | 'Bank Details'
  | 'Legal Documents';

export interface EvidenceUpload {
  name: string;
  documentType?: string;
  confidence?: number;
}

export interface EvidenceCategoryDefinition {
  category: EvidenceCategoryName;
  required: string[];
  optional: string[];
}

export interface EvidenceCategoryState {
  category: EvidenceCategoryName;
  required: string[];
  optional: string[];
  uploaded: string[];
  verified: string[];
  expired: string[];
}

export interface EvidenceModel {
  deal: DealModel;
  uploads: EvidenceUpload[];
}
