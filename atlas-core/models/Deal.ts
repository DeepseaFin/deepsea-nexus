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
}

export interface Pricing {
  invoiceValue: number;
  advanceRate: number;
  discountRate: number;
  brokerCommission: number;
  tenureDays: number;
}

export interface Deal {
  seller: Seller;
  counterparty: Counterparty;
  invoice: Invoice;
  financial: Financial;
  pricing: Pricing;
}
