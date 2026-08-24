import Card from "@/components/Card";
import SectionFrame from "@/components/marketing/home/SectionFrame";

const ATLAS_AREAS = [
  "Counterparty onboarding and profile integrity",
  "Opportunity progression and readiness checks",
  "Work queue visibility for institutional teams",
  "Document and evidence alignment across stakeholders",
] as const;

export default function AtlasSection() {
  return (
    <SectionFrame
      id="atlas"
      eyebrow="3. ATLAS"
      title="ATLAS: The Institutional Execution Workspace"
      description="ATLAS is where teams run the operating motion. It structures daily activity across origination, coordination, and execution so institutional throughput remains consistent."
    >
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Card>
          <h3 className="text-lg font-semibold text-slate-100">What ATLAS Delivers</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {ATLAS_AREAS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
        <article className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Execution Focus</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            ATLAS emphasizes operational precision: who owns what, what is blocked, what is complete, and what must happen next.
          </p>
        </article>
      </div>
    </SectionFrame>
  );
}
