"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Deal } from "../../../atlas-core/models/Deal";

type DealContextValue = {
  deal: Deal;
  setDeal: React.Dispatch<React.SetStateAction<Deal>>;
};

const initialDeal: Deal = {
  id: "DNX-2026-000001",
  title: "Emirates Steel Receivables Purchase",
  status: "Under Credit Review",
  createdAt: "29 Jun 2026",
  seller: {
    name: "FinQy Financial Brokers LLC",
    relationship: "Preferred",
    previousDeals: 48,
    outstanding: "AED 4.2M",
    defaults: 0,
  },
  counterparty: {
    name: "Mashreq Bank",
    country: "UAE",
    industry: "Banking",
    internalRating: "AAA",
    averagePaymentDays: 26,
  },
  invoice: {
    currency: "AED",
    invoiceValue: 2500000,
    description: "Emirates Steel Receivables Purchase",
    referenceNumber: "INV-2026-001",
    maturityDate: "2026-09-30",
  },
  financial: {
    fundingRequired: 2250000,
    advanceRate: 90,
    fundingAmount: 2250000,
    tenureDays: 90,
    discountRate: 1.65,
    grossReturn: 18.2,
    netReturn: 16.9,
    brokerCommission: 2.0,
    expectedReturn: 18.2,
    riskRating: "AA",
  },
  pricing: {
    invoiceValue: 2500000,
    advanceRate: 90,
    discountRate: 1.65,
    brokerCommission: 2.0,
    tenureDays: 90,
    fundingAmount: 2250000,
    discountFee: 11475,
    netDisbursement: 2238525,
  },
  risk: {
    rating: "AA",
    score: 88,
    dealSizePass: true,
    minimumReturnPass: true,
    documentationPass: true,
  },
};

const DealContext = createContext<DealContextValue | undefined>(undefined);

export function DealProvider({ children }: { children: ReactNode }) {
  const [deal, setDeal] = useState<Deal>(initialDeal);

  return (
    <DealContext.Provider value={{ deal, setDeal }}>
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const context = useContext(DealContext);

  if (!context) {
    throw new Error("useDeal must be used within a DealProvider");
  }

  return context;
}

export default DealContext;
