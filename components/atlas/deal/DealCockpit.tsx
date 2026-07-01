"use client";

import { useState } from "react";
import DealHeader from "./DealHeader";
import DealKPIs from "./DealKPIs";
import DealTabs from "./DealTabs";
import OverviewWorkspace from "@/components/atlas/workspace/OverviewWorkspace";
import PricingWorkspace from "@/components/atlas/workspace/PricingWorkspace";
import DocumentsWorkspace from "@/components/atlas/workspace/DocumentsWorkspace";

export default function DealCockpit() {
  const [activeTab, setActiveTab] = useState<string>("Overview");

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
      case "Funding":
      case "Payments":
      case "Notes":
      case "Audit":
      case "Term Sheet":
        return (
          <div className="flex items-center justify-center min-h-96">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center shadow-xl">
              <h3 className="text-2xl font-semibold text-white">{activeTab}</h3>
              <p className="mt-2 text-slate-400">Workspace under construction</p>
            </div>
          </div>
        );

      default:
        return <OverviewWorkspace />;
    }
  };

  return (
    <div className="space-y-8">
      <DealHeader />

      <DealKPIs />

      <DealTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {renderContent()}
    </div>
  );
}
