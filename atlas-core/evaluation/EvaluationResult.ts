import type { EvaluationAction } from './EvaluationAction';
import type { EvaluationBlocker } from './EvaluationBlocker';
import type { DecisionRecord } from './DecisionRecord';
import type { EvaluationReadiness } from './Readiness';
import type { EvaluationWarning } from './EvaluationWarning';

export type EvaluationRecommendation =
  | 'proceed'
  | 'proceed_with_conditions'
  | 'review_required'
  | 'decline';

export interface EvaluationEvidenceSummary {
  totalEvidenceItems: number;
  verifiedEvidenceItems: number;
  missingEvidenceItems: number;
  notes?: string[];
}

export interface EvaluationResult {
  score: number;
  readiness: EvaluationReadiness;
  warnings: EvaluationWarning[];
  blockers: EvaluationBlocker[];
  recommendation: EvaluationRecommendation;
  nextActions: EvaluationAction[];
  evidenceSummary: EvaluationEvidenceSummary;
  evaluatedAt: string;
  decisionRecord: DecisionRecord;
}
