"use client";

import React from "react";
import type { CustomerWorkspaceTab, CustomerWorkspaceTabId } from "@/lib/customer/customer-workspace.types";

export interface CustomerTabsProps {
  readonly tabs: readonly CustomerWorkspaceTab[];
  readonly activeTabId: CustomerWorkspaceTabId;
  readonly onTabChange: (tabId: CustomerWorkspaceTabId) => void;
}

export default function CustomerTabs({ tabs, activeTabId, onTabChange }: CustomerTabsProps) {
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndices = tabs
    .map((tab, index) => ({ tab, index }))
    .filter((entry) => !entry.tab.disabled)
    .map((entry) => entry.index);

  const moveFocus = (targetIndex: number) => {
    const nextTab = tabs[targetIndex];
    if (!nextTab || nextTab.disabled) {
      return;
    }

    tabRefs.current[targetIndex]?.focus();
    onTabChange(nextTab.id);
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (enabledIndices.length === 0) {
      return;
    }

    const enabledPosition = enabledIndices.findIndex((value) => value === index);
    if (enabledPosition === -1) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextPosition = (enabledPosition + 1) % enabledIndices.length;
      moveFocus(enabledIndices[nextPosition]);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextPosition = (enabledPosition - 1 + enabledIndices.length) % enabledIndices.length;
      moveFocus(enabledIndices[nextPosition]);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveFocus(enabledIndices[0]);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      moveFocus(enabledIndices[enabledIndices.length - 1]);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-950/65 p-2">
      <div
        className="inline-flex min-w-full items-center gap-1"
        role="tablist"
        aria-label="Customer workspace tabs"
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`customer-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`customer-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              type="button"
              disabled={tab.disabled}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                isActive
                  ? "border border-cyan-600/50 bg-cyan-900/30 text-cyan-100"
                  : "border border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
