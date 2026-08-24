"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type {
  FacilityOverviewItem,
  FundingPanelConfig,
} from "@/lib/customer/funding/funding-panel.types";

export interface FacilityOverviewProps {
  readonly config: FundingPanelConfig;
  readonly facilities: readonly FacilityOverviewItem[];
}

export default function FacilityOverview({ config, facilities }: FacilityOverviewProps) {
  return (
    <SectionCard title={config.overviewTitle} subtitle={config.overviewSubtitle}>
      <div className="space-y-2.5">
        {facilities.map((facility) => (
          <article key={facility.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-100">{facility.facilityName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                  {facility.facilityType} • {facility.status}
                </p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>Limit: {facility.limit}</p>
                <p className="mt-1">Utilized: {facility.utilized}</p>
              </div>
            </div>

            {facility.assessment ? (
              <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-slate-300">
                <p>
                  Recommended: {facility.assessment.recommendedFacility} • Advance Rate: {facility.assessment.advanceRate}
                </p>
                <p className="mt-1">
                  Risk: {facility.assessment.riskLevel} • Turnaround: {facility.assessment.turnaround}
                </p>
              </div>
            ) : null}
          </article>
        ))}

        {facilities.length === 0 ? <PanelEmptyState message="No facilities provided." /> : null}
      </div>
    </SectionCard>
  );
}
