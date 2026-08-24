export type RecourseType =
  | 'Limited Recourse'
  | 'Full Recourse'
  | 'Non-Recourse'
  | string;

export interface CommercialFees {
  processingFee: number;
  legalFee: number;
  otherCharges: number;
}

export interface CommercialInput {
  invoiceAmount: number;
  requestedFunding: number;
  advanceRatePercent: number;
  tenorDays: number;
  discountRatePercent: number;
  fees: CommercialFees;
  currency: string;
  recourseType: RecourseType;
}

export interface CommercialModel extends CommercialInput {
  approvedFunding: number;
}
