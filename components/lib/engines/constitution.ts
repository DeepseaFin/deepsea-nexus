import type { DealModel } from "@/atlas-core/deals/DealModel";

export interface ConstitutionResult {
  dealSize: boolean;
  minimumReturn: boolean;
  rating: boolean;
  documentation: boolean;
}

export function evaluateConstitution(deal: DealModel): ConstitutionResult {
  return {
    dealSize: deal.deal.fundingRequired <= 500000,

    minimumReturn: deal.deal.expectedReturnPercent >= 15,

    rating: ["AAA", "AA"].includes(
      deal.counterparty.internalRating
    ),

    documentation: true,
  };
}