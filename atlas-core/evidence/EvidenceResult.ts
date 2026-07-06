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
  missingEvidence: string[];
  warnings: EvidenceWarning[];
  criticalBlockers: EvidenceBlocker[];
  requiredActions: EvidenceRequiredAction[];
  summary: EvidenceSummary;
}
