import type { CommercialApprovalItem } from "@/src/capabilities/commercial/types/CommercialWorkspaceState";

type ApprovalPanelProps = {
  readonly approvals: readonly CommercialApprovalItem[];
};

export default function ApprovalPanel({ approvals }: ApprovalPanelProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Approval Panel</h2>
      <div className="mt-3 space-y-2">
        {approvals.map((approval) => (
          <article key={approval.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{approval.committee}</p>
            <p className="mt-1 text-xs text-cyan-300 uppercase tracking-[0.12em]">{approval.decision}</p>
            <p className="mt-1 text-xs text-slate-500">Scheduled: {approval.scheduledAt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
