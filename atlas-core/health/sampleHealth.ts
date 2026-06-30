import type { DealHealth } from "./DealHealth";

export const sampleHealth: DealHealth = {
  score: 94,
  status: "ready",
  constitutionPassed: true,
  creditApproved: true,
  riskApproved: true,
  documentationComplete: true,
  pricingValidated: true,
  treasuryReady: false,
  kycCompleted: true,
  strengths: ["AAA Counterparty", "Complete Documentation", "Pricing Approved", "Credit Approved"],
  risks: ["Treasury Approval Pending"],
  recommendation: "Proceed to Treasury Approval before funding.",
};
