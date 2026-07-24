"use client";

import React from "react";
import type { CustomerWorkspaceTab, CustomerWorkspaceTabId } from "@/lib/customer/customer-workspace.types";

export interface CustomerTabsProps {
  readonly tabs: readonly CustomerWorkspaceTab[];
  readonly activeTabId: CustomerWorkspaceTabId;
  readonly onTabChange: (tabId: CustomerWorkspaceTabId) => void;
}

export default function CustomerTabs({ tabs, activeTabId, onTabChange }: CustomerTabsProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-950/65 p-2">
      <div className="inline-flex min-w-full items-center gap-1" role="tablist" aria-label="Customer workspace tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`customer-panel-${tab.id}`}
              type="button"
              disabled={tab.disabled}
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                isActive
                  ? "border border-cyan-600/50 bg-cyan-900/30 text-cyan-100"
                  : "border border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
