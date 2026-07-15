import type { ReceivableDetailState } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type ReceivableDetailProps = {
  readonly detail: ReceivableDetailState;
};

export default function ReceivableDetail({ detail }: ReceivableDetailProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Receivable Detail</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Receivable</p><p className="mt-1 text-sm font-semibold text-slate-100">{detail.receivableId}</p></div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Currency</p><p className="mt-1 text-sm font-semibold text-slate-100">{detail.currency}</p></div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Amount</p><p className="mt-1 text-sm font-semibold text-slate-100">{detail.amount}</p></div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Instrument</p><p className="mt-1 text-sm font-semibold text-slate-100">{detail.instrumentType}</p></div>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <div className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Issue Date</p><p className="mt-1 text-sm text-slate-200">{detail.issueDate}</p></div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Maturity</p><p className="mt-1 text-sm text-slate-200">{detail.maturityDate}</p></div>
        <div className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Country Risk</p><p className="mt-1 text-sm text-cyan-200">{detail.countryRisk}</p></div>
      </div>
    </section>
  );
}
