"use client";

import React from "react";
import { Landmark } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import type { FundingPanelConfig } from "@/lib/customer/funding/funding-panel.types";

export interface FundingHeaderProps {
  readonly config: FundingPanelConfig;
}

export default function FundingHeader({ config }: FundingHeaderProps) {
  return (
    <SectionCard title={config.title} subtitle={config.subtitle}>
      <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-300">
        <Landmark className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
        {config.workspaceLabel}
      </div>
    </SectionCard>
  );
}
