export type EvaluationBlockerSeverity = 'high' | 'critical';

export interface EvaluationBlocker {
  code: string;
  title: string;
  message: string;
  severity: EvaluationBlockerSeverity;
  sourceEngine: string;
  requiredResolution: string;
  ownerRole?: string;
}
