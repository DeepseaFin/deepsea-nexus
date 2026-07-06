"use client";

import { sampleApprovals } from "../../../atlas-core/approvals/sampleApprovals";
import { formatDateTime } from "@/lib/utils/formatters";

const statusStyles: Record<string, string> = {
  approved: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  pending: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  waiting: "border-slate-700 bg-slate-800/80 text-slate-300",
  rejected: "border-rose-500/30 bg-rose-500/15 text-rose-400",
};

const statusIcons: Record<string, string> = {
  approved: "✓",
  pending: "•",
  waiting: "◌",
  rejected: "✕",
};

function formatTimestamp(value?: string) {
  if (!value) return "Pending";

  return formatDateTime(value, {
    locale: "en-US",
    options: {
      dateStyle: "medium",
      timeStyle: "short",
    },
  });
}

export default function ApprovalPanel() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Approval Board</h2>
        <p className="mt-1 text-sm text-slate-400">Institutional Approval Workflow</p>
      </div>

      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
        {sampleApprovals.map((approval) => {
          const statusClass = statusStyles[approval.status] ?? statusStyles.waiting;
          const icon = statusIcons[approval.status] ?? statusIcons.waiting;

          return (
            <div
              key={approval.id}
              className="rounded-xl border border-slate-800 bg-slate-950/80 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${statusClass}`}
                  >
                    {icon}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{approval.approver}</h3>
                      <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {approval.role}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{approval.stage}</p>
                  </div>
                </div>

                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}>
                  {approval.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Decision</p>
                  <p className="mt-1 font-medium text-slate-200">{formatTimestamp(approval.decisionDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">SLA</p>
                  <p className="mt-1 font-medium text-slate-200">{approval.slaHours} hrs</p>
                </div>
              </div>

              {approval.comments ? (
                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Comments</p>
                  <p className="mt-1 text-sm text-slate-300">{approval.comments}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
