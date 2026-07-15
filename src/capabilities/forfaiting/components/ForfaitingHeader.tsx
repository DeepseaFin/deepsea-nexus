import type { ForfaittingWorkspaceState } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type ForfaitingHeaderProps = {
  readonly workspace: ForfaittingWorkspaceState;
};

export default function ForfaitingHeader({ workspace }: ForfaitingHeaderProps) {
  return (
    <header className="rounded-2xl border border-slate-800/90 bg-slate-900/50 px-5 py-4 shadow-[0_12px_32px_rgba(2,6,23,0.24)] sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">ATLAS / FORFAITING</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Forfaiting Operating System Workspace</h1>
          <p className="mt-1 text-sm text-slate-300">{workspace.deskName} · {workspace.portfolioName}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Workspace</p>
            <p className="mt-1 font-semibold text-slate-200">{workspace.workspaceId}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Status</p>
            <span className="mt-1 inline-flex rounded-full border border-cyan-700/50 bg-cyan-950/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
              {workspace.status}
            </span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Review</p>
            <p className="mt-1 font-semibold text-slate-200">{workspace.reviewDate}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Receivables</p>
            <p className="mt-1 font-semibold text-emerald-200">{workspace.receivableQueue.length}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
