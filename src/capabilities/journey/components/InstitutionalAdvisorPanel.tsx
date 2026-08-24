import { BriefcaseBusiness } from "lucide-react";

type InstitutionalAdvisorPanelProps = {
  readonly overallAssessment?: string;
  readonly confidenceIndicator?: string;
  readonly keyObservations?: readonly string[];
  readonly recommendedNextActions?: readonly string[];
  readonly outstandingInformation?: readonly string[];
  readonly className?: string;
};

const DEFAULT_KEY_OBSERVATIONS = [
  "Institution profile shows stable operating continuity across current journey checkpoints.",
  "Core identity and evidence quality appear aligned with workflow progression expectations.",
  "Governance readiness depends on closure of remaining documentation dependencies.",
] as const;

const DEFAULT_RECOMMENDED_NEXT_ACTIONS = [
  "Complete outstanding evidence validations before advancing governance review.",
  "Confirm document lineage references for all newly added institutional records.",
  "Prepare a concise executive summary for downstream approval stakeholders.",
] as const;

const DEFAULT_OUTSTANDING_INFORMATION = [
  "Final board-resolution addendum",
  "Counterparty aging support package",
  "Updated insurance endorsement reference",
] as const;

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function ListBlock({
  title,
  items,
}: {
  readonly title: string;
  readonly items: readonly string[];
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No entries available in this section.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function InstitutionalAdvisorPanel({
  overallAssessment = "Institution appears operationally prepared to proceed, pending closure of remaining evidence dependencies.",
  confidenceIndicator = "Confidence Indicator Placeholder: 84%",
  keyObservations = DEFAULT_KEY_OBSERVATIONS,
  recommendedNextActions = DEFAULT_RECOMMENDED_NEXT_ACTIONS,
  outstandingInformation = DEFAULT_OUTSTANDING_INFORMATION,
  className,
}: InstitutionalAdvisorPanelProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)}>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Institutional Advisor</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Executive Guidance</h2>
          <p className="mt-2 text-sm text-slate-400">Strategic placeholder guidance for institutional operators and review committees.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
            Action Placeholder
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            {confidenceIndicator}
          </div>
        </div>
      </header>

      <section className="mb-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-cyan-300" /> Overall Assessment
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{overallAssessment}</p>
      </section>

      <div className="grid gap-3 xl:grid-cols-3">
        <ListBlock title="Key Observations" items={keyObservations} />
        <ListBlock title="Recommended Next Actions" items={recommendedNextActions} />
        <ListBlock title="Outstanding Information" items={outstandingInformation} />
      </div>
    </section>
  );
}