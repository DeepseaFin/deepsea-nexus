"use client";

import { useState } from "react";

interface DealTabsProps {
  activeTab?: string;
  onTabChange?: (tabName: string) => void;
}

const TAB_LIST = [
  "Overview",
  "Pricing",
  "Risk",
  "Documents",
  "Term Sheet",
  "Funding",
  "Payments",
  "Notes",
  "Audit",
];

export default function DealTabs({ activeTab: initialActiveTab = "Overview", onTabChange }: DealTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(initialActiveTab);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex overflow-x-auto">
        {TAB_LIST.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
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
  );
}
