"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type {
  PassportPanelConfig,
  PassportPanelModel,
} from "@/lib/customer/business-passport/passport-panel.types";

function clamped(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
}

export interface BusinessPassportProgressProps {
  readonly config: PassportPanelConfig;
  readonly model: PassportPanelModel;
}

export default function BusinessPassportProgress({ config, model }: BusinessPassportProgressProps) {
  const percent = clamped(model.completionPercent);

  return (
    <SectionCard title={config.progressHeader.title} subtitle={config.progressHeader.subtitle}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{model.completionLabel}</span>
          <span className="font-medium text-cyan-200">{percent}%</span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-900"
          aria-label="Passport completion progress"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.45),rgba(56,189,248,0.95))] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </SectionCard>
  );
}
