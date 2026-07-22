import { Milestone } from "lucide-react";

export interface JourneyTimelineMilestone {
  readonly title:
    | "Journey Created"
    | "Business Passport Completed"
    | "Evidence Uploaded"
    | "Evidence Reviewed"
    | "Advisor Recommendation Generated";
  readonly timestamp: string;
  readonly detail: string;
}

type JourneyTimelinePanelProps = {
  readonly milestones?: readonly JourneyTimelineMilestone[];
  readonly className?: string;
};

const DEFAULT_MILESTONES: readonly JourneyTimelineMilestone[] = [
  {
    title: "Journey Created",
    timestamp: "2026-07-12 08:10",
    detail: "Institutional workflow initialized for relationship onboarding.",
  },
  {
    title: "Business Passport Completed",
    timestamp: "2026-07-12 14:45",
    detail: "Core institutional identity baseline established for workspace operations.",
  },
  {
    title: "Evidence Uploaded",
    timestamp: "2026-07-13 08:35",
    detail: "Supporting institutional documentation set attached for review.",
  },
  {
    title: "Evidence Reviewed",
    timestamp: "2026-07-13 09:20",
    detail: "Evidence completeness and confidence inspected for progression readiness.",
  },
  {
    title: "Advisor Recommendation Generated",
    timestamp: "2026-07-13 09:35",
    detail: "Executive guidance placeholder produced for institutional decision support.",
  },
];

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export default function JourneyTimelinePanel({
  milestones = DEFAULT_MILESTONES,
  className,
}: JourneyTimelinePanelProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)}>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Journey Timeline</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Institutional Milestones</h2>
          <p className="mt-2 text-sm text-slate-400">Sequenced institutional events for executive review and operational continuity.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          Action Placeholder
        </div>
      </header>

      {milestones.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">No timeline milestones are currently available.</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Placeholder state</p>
        </div>
      ) : (
        <ol className="space-y-4">
          {milestones.map((milestone, index) => {
            const isLast = index === milestones.length - 1;

            return (
              <li key={`${milestone.title}-${milestone.timestamp}`} className="relative pl-8">
                {!isLast ? (
                  <span className="absolute left-[11px] top-6 h-[calc(100%+0.75rem)] w-px bg-slate-800" aria-hidden="true" />
                ) : null}
                <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-950" aria-hidden="true">
                  <Milestone className="h-3.5 w-3.5 text-cyan-300" />
                </span>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{milestone.title}</h3>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{milestone.timestamp}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{milestone.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}