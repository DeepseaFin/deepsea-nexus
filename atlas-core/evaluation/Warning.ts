export type EvaluationWarningSeverity = 'low' | 'medium' | 'high';

export interface EvaluationWarning {
  code: string;
  title: string;
  message: string;
  severity: EvaluationWarningSeverity;
  sourceEngine: string;
  field?: string;
}
