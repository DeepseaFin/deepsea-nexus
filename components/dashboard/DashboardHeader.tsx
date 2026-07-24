"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { DashboardHeaderModel } from "@/lib/dashboard/dashboard.types";

export interface DashboardHeaderProps {
  readonly model: DashboardHeaderModel;
}

export default function DashboardHeader({ model }: DashboardHeaderProps) {
  return (
    <header className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-4 shadow-[0_14px_30px_rgba(2,6,23,0.24)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">Institutional Dashboard</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
            {model.greeting}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{model.roleLabel}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <label className="relative inline-flex items-center">
            <span className="sr-only">Workspace selector</span>
            <select
              value={model.selectedWorkspaceId}
              onChange={(event) => model.onWorkspaceChange?.(event.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 py-2 pl-3 pr-9 text-sm text-slate-100 outline-none transition focus:border-cyan-600/50 sm:w-56"
            >
              {model.workspaceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" />
          </label>

          <span className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
            {model.currentDate}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {(model.actions ?? []).map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.id}
                  type="button"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-600/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
