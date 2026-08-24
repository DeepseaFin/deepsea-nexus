"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type {
  PassportPanelConfig,
  PassportPanelStatus,
} from "@/lib/customer/business-passport/passport-panel.types";

export interface BusinessPassportStatusCardProps {
  readonly config: PassportPanelConfig;
  readonly status: PassportPanelStatus;
  readonly states: readonly PassportPanelStatus[];
}

export default function BusinessPassportStatusCard({
  config,
  status,
  states,
}: BusinessPassportStatusCardProps) {
  return (
    <SectionCard title={config.statusLabel} subtitle="Configurable lifecycle states for workspace-level review tracking">
      <div className="flex flex-wrap gap-2" role="list" aria-label="Passport status states">
        {states.map((state) => {
          const isCurrent = state === status;

          return (
            <span
              key={state}
              role="listitem"
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                isCurrent
                  ? "border-cyan-600/60 bg-cyan-900/35 text-cyan-100"
                  : "border-slate-700 bg-slate-900 text-slate-400"
              }`}
            >
              {state}
            </span>
          );
        })}
      </div>
    </SectionCard>
  );
}
