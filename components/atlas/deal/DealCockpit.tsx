"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import DealHeader from "./DealHeader";
import DealKPIs from "./DealKPIs";
import DealStudio from "./DealStudio";
import OverviewWorkspace from "@/components/atlas/workspace/OverviewWorkspace";
import PricingWorkspace from "@/components/atlas/workspace/PricingWorkspace";
import RiskWorkspace from "@/components/atlas/workspace/RiskWorkspace";
import DocumentsWorkspace from "@/components/atlas/workspace/DocumentsWorkspace";
import CreditMemoWorkspace from "@/components/atlas/workspace/CreditMemoWorkspace";
import TermSheetWorkspace from "@/components/atlas/workspace/TermSheetWorkspace";
import FundingWorkspace from "@/components/atlas/workspace/FundingWorkspace";
import PaymentsWorkspace from "@/components/atlas/workspace/PaymentsWorkspace";
import NotesWorkspace from "@/components/atlas/workspace/NotesWorkspace";
import AuditWorkspace from "@/components/atlas/workspace/AuditWorkspace";

const TAB_LIST = [
  "Overview",
  "Pricing",
  "Risk",
  "Documents",
  "Credit Memo",
  "Term Sheet",
  "Funding",
  "Payments",
  "Notes",
  "Audit",
];

export default function DealCockpit() {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [showDealStudio, setShowDealStudio] = useState(false);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewWorkspace />;

      case "Pricing":
        return <PricingWorkspace />;

      case "Documents":
        return <DocumentsWorkspace />;

      case "Credit Memo":
        return <CreditMemoWorkspace />;

      case "Risk":
        return <RiskWorkspace />;

      case "Funding":
        return <FundingWorkspace />;

      case "Payments":
        return <PaymentsWorkspace />;

      case "Notes":
        return <NotesWorkspace />;

      case "Audit":
        return <AuditWorkspace />;

      case "Term Sheet":
        return <TermSheetWorkspace />;

      default:
        return <OverviewWorkspace />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowDealStudio(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-900/40"
        >
          <PlusCircle className="h-4 w-4" />
          New Financing Transaction
        </button>
      </div>

      {showDealStudio ? (
        <DealStudio />
      ) : (
        <>
      <DealHeader />

      <DealKPIs />

      <div className="bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex overflow-x-auto">
          {TAB_LIST.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-4 whitespace-nowrap font-medium transition-all ${
                activeTab === tab
                  ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50"
                  : "text-slate-400 border-b-2 border-transparent hover:text-cyan-300 hover:border-cyan-400/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
        </>
      )}
    </div>
  );
}
