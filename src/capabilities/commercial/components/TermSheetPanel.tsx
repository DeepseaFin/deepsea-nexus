import type { CommercialTermSheetItem } from "@/src/capabilities/commercial/types/CommercialWorkspaceState";

type TermSheetPanelProps = {
  readonly termSheets: readonly CommercialTermSheetItem[];
};

export default function TermSheetPanel({ termSheets }: TermSheetPanelProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Term Sheet Panel</h2>
      <div className="mt-3 space-y-2">
        {termSheets.map((sheet) => (
          <article key={sheet.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">Version {sheet.version}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">{sheet.status}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Owner: {sheet.owner}</p>
            <p className="text-xs text-slate-500">Updated: {sheet.updatedAt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
