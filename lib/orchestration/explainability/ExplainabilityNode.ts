export enum ExplainabilityNodeType {
  Recommendation = "recommendation",
  RiskSignal = "risk_signal",
  HealthDimension = "health_dimension",
  ProfileDimension = "profile_dimension",
  BusinessSignal = "business_signal",
  Fact = "fact",
  Knowledge = "knowledge",
  Evidence = "evidence",
}

export interface ExplainabilityNode {
  readonly id: string;
  readonly type: ExplainabilityNodeType;
  readonly title: string;
  readonly description: string;
  readonly confidence: number;
}
