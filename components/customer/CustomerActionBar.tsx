"use client";

import React from "react";
import ActionBar from "@/components/ui/ActionBar";
import type { CustomerWorkspaceAction } from "@/lib/customer/customer-workspace.types";

export interface CustomerActionBarProps {
  readonly actions: readonly CustomerWorkspaceAction[];
}

export default function CustomerActionBar({ actions }: CustomerActionBarProps) {
  return (
    <ActionBar className="justify-start md:justify-end" aria-label="Customer workspace actions">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-600/45 hover:bg-cyan-900/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {action.label}
          </button>
        );
      })}
    </ActionBar>
  );
}
