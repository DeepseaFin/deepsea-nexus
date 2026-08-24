export interface DecisionRecord {
  finding: string;
  rationale: string;
  policyReference: string[];
  supportingEvidence: string[];
  confidence: number;
}
