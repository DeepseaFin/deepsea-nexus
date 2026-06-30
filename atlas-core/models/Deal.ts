export interface Seller {
  name: string;
  relationship: string;
  previousDeals: number;
  outstanding: string;
  defaults: number;
}

export interface Counterparty {
  name: string;
  country: string;
  industry: string;
  internalRating: string;
  averagePaymentDays: number;
}

export interface Invoice {
  currency: string;
  invoiceValue: number;
  description: string;
  maturityDate?: string;
  referenceNumber?: string;
}

export interface Financial {
  fundingRequired: number;
  advanceRate: number;
  fundingAmount: number;
  tenureDays: number;
  discountRate: number;
  grossReturn: number;
  netReturn: number;
  brokerCommission: number;
  expectedReturn?: number;
  riskRating?: string;
}

export interface Pricing {
  invoiceValue: number;
  advanceRate: number;
  discountRate: number;
  brokerCommission: number;
  tenureDays: number;
  fundingAmount?: number;
  discountFee?: number;
  netDisbursement?: number;
}

export interface Risk {
  rating: string;
  score?: number;
  dealSizePass?: boolean;
  minimumReturnPass?: boolean;
  documentationPass?: boolean;
}

export interface Deal {
  id?: string;
  title?: string;
  status?: string;
  createdAt?: string;
  seller: Seller;
  counterparty: Counterparty;
  invoice: Invoice;
  financial: Financial;
  pricing: Pricing;
  risk: Risk;
}
