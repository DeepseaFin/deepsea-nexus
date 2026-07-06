"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import DealHeader from "./DealHeader";
import DealKPIs from "./DealKPIs";
import DealTabs from "./DealTabs";
import DealStudio from "./DealStudio";
import OverviewWorkspace from "@/components/atlas/workspace/OverviewWorkspace";
import PricingWorkspace from "@/components/atlas/workspace/PricingWorkspace";
import RiskWorkspace from "@/components/atlas/workspace/RiskWorkspace";
import DocumentsWorkspace from "@/components/atlas/workspace/DocumentsWorkspace";
import TermSheetWorkspace from "@/components/atlas/workspace/TermSheetWorkspace";
import FundingWorkspace from "@/components/atlas/workspace/FundingWorkspace";
import PaymentsWorkspace from "@/components/atlas/workspace/PaymentsWorkspace";
import NotesWorkspace from "@/components/atlas/workspace/NotesWorkspace";
import AuditWorkspace from "@/components/atlas/workspace/AuditWorkspace";

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

      <DealTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {renderContent()}
        </>
      )}
    </div>
  );
}
