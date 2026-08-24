export function calculateDealHealth(params: {
  constitutionPassed: boolean;
  creditApproved: boolean;
  riskApproved: boolean;
  documentationComplete: boolean;
  pricingValidated: boolean;
  treasuryReady: boolean;
  kycCompleted: boolean;
}): {
  score: number;
  status: "ready" | "review" | "blocked";
} {
  const weights = {
    constitution: 20,
    credit: 20,
    risk: 20,
    documentation: 15,
    pricing: 10,
    treasury: 10,
    kyc: 5,
  };

  const score =
    (params.constitutionPassed ? weights.constitution : 0) +
    (params.creditApproved ? weights.credit : 0) +
    (params.riskApproved ? weights.risk : 0) +
    (params.documentationComplete ? weights.documentation : 0) +
    (params.pricingValidated ? weights.pricing : 0) +
    (params.treasuryReady ? weights.treasury : 0) +
    (params.kycCompleted ? weights.kyc : 0);

  let status: "ready" | "review" | "blocked";

  if (score >= 90) {
    status = "ready";
  } else if (score >= 75) {
    status = "review";
  } else {
    status = "blocked";
  }

  return { score, status };
}
