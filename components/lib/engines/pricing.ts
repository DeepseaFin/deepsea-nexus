export interface PricingInput {
  invoiceValue: number;
  advanceRate: number;
  tenure: number;
  discountRate: number;
  brokerCommission: number;
}

export interface PricingResult {
  fundingAmount: number;
  discountFee: number;
  brokerFee: number;
  netDisbursement: number;
}

export function calculatePricing(
  input: PricingInput
): PricingResult {

  const fundingAmount =
    input.invoiceValue * (input.advanceRate / 100);

  const discountFee =
    fundingAmount *
    (input.discountRate / 100) *
    (input.tenure / 365);

  const brokerFee =
    fundingAmount *
    (input.brokerCommission / 100);

  const netDisbursement =
    fundingAmount -
    discountFee -
    brokerFee;

  return {
    fundingAmount,
    discountFee,
    brokerFee,
    netDisbursement,
  };
}
