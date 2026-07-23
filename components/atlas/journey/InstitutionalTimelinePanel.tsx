import { Milestone } from "lucide-react";
import type { InstitutionalTimelineProjection } from "@/src/capabilities/journey/adapters/getInstitutionalTimelineProjection";

type InstitutionalTimelinePanelProps = {
  readonly timeline: InstitutionalTimelineProjection;
  readonly className?: string;
};

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function statusClassName(status: "completed" | "pending"): string {
  return status === "completed"
    ? "border-emerald-700/40 bg-emerald-950/40 text-emerald-200"
    : "border-amber-700/40 bg-amber-950/40 text-amber-200";
}

export default function InstitutionalTimelinePanel({
  timeline,
  className,
}: InstitutionalTimelinePanelProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)}>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Institutional Timeline</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Canonical Journey Chronology</h2>
          <p className="mt-2 text-sm text-slate-400">Chronological institutional events sourced from journey and audit artifacts.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {timeline.currentJourneyStatus}
        </div>
      </header>

      {timeline.events.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">No institutional timeline events are currently available.</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Canonical projection empty state</p>
        </div>
      ) : (
        <ol className="space-y-4">
          {timeline.events.map((event, index) => {
            const isLast = index === timeline.events.length - 1;

            return (
              <li key={`${event.title}-${event.timestamp}-${index}`} className="relative pl-8">
                {!isLast ? (
                  <span className="absolute left-[11px] top-6 h-[calc(100%+0.75rem)] w-px bg-slate-800" aria-hidden="true" />
                ) : null}
                <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-950" aria-hidden="true">
                  <Milestone className="h-3.5 w-3.5 text-cyan-300" />
                </span>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{event.title}</h3>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{event.timestamp}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{event.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClassName(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-300">
                      Ref: {event.artifactReference}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
