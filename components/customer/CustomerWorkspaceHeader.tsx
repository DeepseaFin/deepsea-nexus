"use client";

import React from "react";
import CustomerActionBar from "@/components/customer/CustomerActionBar";
import type { CustomerWorkspaceAction } from "@/lib/customer/customer-workspace.types";

export interface CustomerWorkspaceHeaderProps {
  readonly title: string;
  readonly subtitle: string;
  readonly customerId?: string;
  readonly actions: readonly CustomerWorkspaceAction[];
}

export default function CustomerWorkspaceHeader({
  title,
  subtitle,
  customerId,
  actions,
}: CustomerWorkspaceHeaderProps) {
  return (
    <header className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-4 shadow-[0_14px_30px_rgba(2,6,23,0.24)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">Customer Workspace</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          {customerId ? (
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">Customer ID: {customerId}</p>
          ) : null}
        </div>

        <div className="w-full lg:w-auto">
          <CustomerActionBar actions={actions} />
        </div>
      </div>
    </header>
  );
}
