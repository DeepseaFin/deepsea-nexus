export interface DealHealth {
  score: number;
  status: "ready" | "review" | "blocked";
  constitutionPassed: boolean;
  creditApproved: boolean;
  riskApproved: boolean;
  documentationComplete: boolean;
  pricingValidated: boolean;
  treasuryReady: boolean;
  kycCompleted: boolean;
  strengths: string[];
  risks: string[];
  recommendation: string;
}
