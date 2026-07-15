import type { ForfaittingWorkspaceState } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type ForfaitingHeaderProps = {
  readonly workspace: ForfaittingWorkspaceState;
};

export default function ForfaitingHeader({ workspace }: ForfaitingHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / FORFAITING</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">Forfaiting Operating System Workspace</h1>
          <p className="mt-1 text-sm text-slate-400">{workspace.deskName} · {workspace.portfolioName}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Workspace</p>
            <p className="mt-1 font-semibold text-slate-200">{workspace.workspaceId}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Status</p>
            <p className="mt-1 font-semibold text-cyan-200">{workspace.status}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Review</p>
            <p className="mt-1 font-semibold text-slate-200">{workspace.reviewDate}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Receivables</p>
            <p className="mt-1 font-semibold text-emerald-200">{workspace.receivableQueue.length}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
