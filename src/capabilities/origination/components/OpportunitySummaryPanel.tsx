type OpportunitySummaryPanelProps = {
  summary: {
    opportunitySummary: string;
    requiredDocuments: string[];
    missingDocuments: string[];
    suggestedNextAction: string;
  };
};

export default function OpportunitySummaryPanel({ summary }: OpportunitySummaryPanelProps) {
  return (
    <aside className="space-y-2 xl:w-[360px]">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Opportunity Summary</h2>
        <p className="mt-2 text-sm text-slate-300">{summary.opportunitySummary}</p>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Required Documents</h3>
        <div className="mt-2 space-y-1 text-sm text-slate-300">
          {summary.requiredDocuments.map((item) => (
            <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">{item}</p>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Missing Documents</h3>
        <div className="mt-2 space-y-1 text-sm text-amber-200">
          {summary.missingDocuments.map((item) => (
            <p key={item} className="rounded border border-amber-700/30 bg-amber-950/20 px-2 py-1">{item}</p>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Suggested Next Action</h3>
        <p className="mt-2 text-sm text-cyan-200">{summary.suggestedNextAction}</p>
      </section>
    </aside>
  );
}
