"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type {
  ApprovalPanelConfig,
  ApprovalParticipantItem,
} from "@/lib/customer/approval/approval-panel.types";

function toLabel(value: string): string {
  return value.replace(/_/g, " ");
}

function decisionTone(value: ApprovalParticipantItem["decision"]): string {
  if (value === "approve") {
    return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
  }

  if (value === "reject") {
    return "border-rose-700/50 bg-rose-900/25 text-rose-200";
  }

  if (value === "request_changes") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  return "border-slate-700 bg-slate-900 text-slate-300";
}

export interface ApprovalParticipantsProps {
  readonly config: ApprovalPanelConfig;
  readonly participants: readonly ApprovalParticipantItem[];
}

export default function ApprovalParticipants({ config, participants }: ApprovalParticipantsProps) {
  return (
    <SectionCard title={config.participantsTitle} subtitle={config.participantsSubtitle}>
      <ul className="space-y-2.5" aria-label="Approval participants">
        {participants.map((item) => (
          <li key={item.participant.actor.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-100">{item.participant.actor.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                  Role: {toLabel(item.participant.actor.role)}
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${decisionTone(item.decision)}`}
              >
                {toLabel(item.decision)}
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              <p>Status: {item.status}</p>
              {item.participant.metadata.notes ? <p className="mt-1">{item.participant.metadata.notes}</p> : null}
            </div>
          </li>
        ))}

        {participants.length === 0 ? <li className="text-sm text-slate-400">No participants configured.</li> : null}
      </ul>
    </SectionCard>
  );
}
