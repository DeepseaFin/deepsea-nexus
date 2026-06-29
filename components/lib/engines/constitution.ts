export interface ConstitutionResult {
  dealSize: boolean;
  minimumReturn: boolean;
  rating: boolean;
  documentation: boolean;
}

export function evaluateConstitution(deal: any): ConstitutionResult {
  return {

    dealSize:
      deal.financial.fundingAmount <= 500000,

    minimumReturn:
      deal.financial.netReturn >= 15,

    rating:
      ["AAA", "AA"].includes(
        deal.counterparty.rating
      ),

    documentation: true,

  };
}