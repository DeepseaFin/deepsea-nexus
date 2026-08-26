import React from "react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import type { DashboardApprovalItem } from "@/lib/dashboard/dashboard.types";

export interface UpcomingApprovalsPanelProps {
  readonly approvals: readonly DashboardApprovalItem[];
}

export default function UpcomingApprovalsPanel({ approvals }: UpcomingApprovalsPanelProps) {
  return (
    <DashboardSection
      title="Upcoming Approvals"
      subtitle="Summary of upcoming approval decisions"
    >
      {approvals.length === 0 ? (
        <EmptyState
          title="No upcoming approvals"
          description="Approval summary items will appear here when approval projections are provided."
        />
      ) : (
        <ul className="space-y-2">
          {approvals.map((approval) => (
            <li key={approval.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-slate-100">{approval.subject}</h3>
                <StatusChip label={approval.status ?? "default"} variant={approval.status ?? "default"} />
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Stage: {approval.stage}</span>
                {approval.dueLabel ? <span>Due: {approval.dueLabel}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
