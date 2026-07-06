import type { EvidenceCategoryState } from '@/atlas-core/evidence/EvidenceModel';

export type EvidenceWarningSeverity = 'low' | 'medium' | 'high';

export interface EvidenceWarning {
  code: string;
  severity: EvidenceWarningSeverity;
  message: string;
}

export interface EvidenceBlocker {
  code: string;
  message: string;
}

export type EvidenceDocumentStatus = 'verified' | 'pending' | 'missing';

export interface EvidenceDocumentItem {
  id: string;
  category: string;
  name: string;
  mandatory: boolean;
  status: EvidenceDocumentStatus;
  verification: 'verified' | 'pending';
  confidence?: number;
  isCritical: boolean;
}

export type EvidenceRecommendation =
  | 'Proceed'
  | 'Proceed with Conditions'
  | 'Do Not Proceed';

export interface EvidenceRequiredAction {
  id: string;
  action: string;
  owner: string;
}

export interface EvidenceSummary {
  headline: string;
  narrative: string;
}

export interface EvidenceResult {
  readiness: number;
  categories: EvidenceCategoryState[];
  requiredDocuments: EvidenceDocumentItem[];
  missingMandatoryDocuments: EvidenceDocumentItem[];
  verifiedDocuments: EvidenceDocumentItem[];
  recommendation: EvidenceRecommendation;
  criticalDocumentsPending: number;
  missingEvidence: string[];
  warnings: EvidenceWarning[];
  criticalBlockers: EvidenceBlocker[];
  requiredActions: EvidenceRequiredAction[];
  summary: EvidenceSummary;
}
