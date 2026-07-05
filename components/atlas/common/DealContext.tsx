"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  createEmptyDeal,
  type ApprovalState,
  type ClientInfo,
  type CommercialTerms,
  type CounterpartyInfo,
  type DealInfo,
  type DealModel,
  type DocumentState,
  type IntelligenceState,
  type WorkflowState,
} from "@/atlas-core/deals/DealModel";

type DealContextValue = {
  deal: DealModel;
  setDeal: React.Dispatch<React.SetStateAction<DealModel>>;
  updateDeal: (payload: Partial<DealInfo>) => void;
  updateClient: (payload: Partial<ClientInfo>) => void;
  updateCounterparty: (payload: Partial<CounterpartyInfo>) => void;
  updateCommercialTerms: (payload: Partial<CommercialTerms>) => void;
  updateDocuments: (payload: Partial<DocumentState>) => void;
  updateIntelligence: (payload: Partial<IntelligenceState>) => void;
  updateApproval: (payload: Partial<ApprovalState>) => void;
  updateWorkflow: (payload: Partial<WorkflowState>) => void;
};

const DealContext = createContext<DealContextValue | undefined>(undefined);

export function DealProvider({ children }: { children: ReactNode }) {
  const [deal, setDeal] = useState<DealModel>(createEmptyDeal());

  const updateDeal = (payload: Partial<DealInfo>) => {
    setDeal((prev) => ({ ...prev, deal: { ...prev.deal, ...payload } }));
  };

  const updateClient = (payload: Partial<ClientInfo>) => {
    setDeal((prev) => ({ ...prev, client: { ...prev.client, ...payload } }));
  };

  const updateCounterparty = (payload: Partial<CounterpartyInfo>) => {
    setDeal((prev) => ({ ...prev, counterparty: { ...prev.counterparty, ...payload } }));
  };

  const updateCommercialTerms = (payload: Partial<CommercialTerms>) => {
    setDeal((prev) => ({ ...prev, commercialTerms: { ...prev.commercialTerms, ...payload } }));
  };

  const updateDocuments = (payload: Partial<DocumentState>) => {
    setDeal((prev) => ({ ...prev, documents: { ...prev.documents, ...payload } }));
  };

  const updateIntelligence = (payload: Partial<IntelligenceState>) => {
    setDeal((prev) => ({ ...prev, intelligence: { ...prev.intelligence, ...payload } }));
  };

  const updateApproval = (payload: Partial<ApprovalState>) => {
    setDeal((prev) => ({ ...prev, approval: { ...prev.approval, ...payload } }));
  };

  const updateWorkflow = (payload: Partial<WorkflowState>) => {
    setDeal((prev) => ({ ...prev, workflow: { ...prev.workflow, ...payload } }));
  };

  return (
    <DealContext.Provider
      value={{
        deal,
        setDeal,
        updateDeal,
        updateClient,
        updateCounterparty,
        updateCommercialTerms,
        updateDocuments,
        updateIntelligence,
        updateApproval,
        updateWorkflow,
      }}
    >
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
