"use client";

import React from "react";
import { BadgeCheck, Clock3 } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type {
  PassportPanelConfig,
  PassportPanelModel,
} from "@/lib/customer/business-passport/passport-panel.types";

function toLabel(value: string): string {
  return value.replace(/_/g, " ");
}

export interface BusinessPassportHeaderProps {
  readonly config: PassportPanelConfig;
  readonly model: PassportPanelModel;
}

export default function BusinessPassportHeader({ config, model }: BusinessPassportHeaderProps) {
  return (
    <SectionCard title={config.heading} subtitle={config.subtitle}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-800 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Passport ID</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-100">
            <BadgeCheck className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            {model.passport.passportId.toString()}
          </p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Canonical Status</p>
          <div className="mt-1">
            <StatusChip label={toLabel(model.passport.status)} variant="info" />
          </div>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Lifecycle</p>
          <p className="mt-1 text-sm font-medium capitalize text-slate-100">{toLabel(model.passport.lifecycle)}</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/75 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Last Updated</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-100">
            <Clock3 className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {new Date(model.passport.metadata.audit.updatedAt).toLocaleDateString()}
          </p>
        </article>
      </div>
    </SectionCard>
  );
}
