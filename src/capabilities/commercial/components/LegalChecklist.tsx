import type { CommercialLegalItem } from "@/src/capabilities/commercial/types/CommercialWorkspaceState";

type LegalChecklistProps = {
  readonly legalChecklist: readonly CommercialLegalItem[];
};

export default function LegalChecklist({ legalChecklist }: LegalChecklistProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Legal Checklist</h2>
      <ul className="mt-3 space-y-2">
        {legalChecklist.map((item) => (
          <li key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.item}</p>
            <p className="mt-1 text-xs text-slate-400">Owner: {item.owner}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
