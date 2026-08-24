import { Milestone, Users } from "lucide-react";
import type { RelationshipInteractionProjection } from "@/src/capabilities/relationship/projections/RelationshipInteractionProjection";

interface RelationshipInteractionTimelineProps {
  readonly interactions: readonly RelationshipInteractionProjection[];
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export default function RelationshipInteractionTimeline({
  interactions,
  className,
}: RelationshipInteractionTimelineProps) {
  const timeline = interactions;

  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)} aria-label="Relationship interaction timeline">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Relationship Interactions</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Interaction Timeline</h2>
          <p className="mt-2 text-sm text-slate-400">Canonical interaction stream for ongoing institutional relationship operations.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {timeline.length} Events
        </div>
      </header>

      {timeline.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">No relationship interactions are currently available.</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Projection empty state</p>
        </div>
      ) : (
        <ol className="space-y-4">
          {timeline.map((interaction, index) => {
            const isLast = index === timeline.length - 1;

            return (
              <li key={interaction.interactionId} className="relative pl-8">
                {!isLast ? (
                  <span className="absolute left-[11px] top-6 h-[calc(100%+0.75rem)] w-px bg-slate-800" aria-hidden="true" />
                ) : null}
                <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-950" aria-hidden="true">
                  <Milestone className="h-3.5 w-3.5 text-cyan-300" />
                </span>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{interaction.subject}</h3>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{interaction.occurredAt}</p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 uppercase tracking-[0.12em] text-slate-300">
                      {interaction.interactionType}
                    </span>
                    <span className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-2 py-1 uppercase tracking-[0.12em] text-cyan-200">
                      {interaction.status}
                    </span>
                  </div>

                  <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Participants</p>
                    <p className="mt-1 text-xs text-slate-300">
                      <Users className="mr-1 inline h-3 w-3 text-cyan-300" />
                      {interaction.participants.length === 0 ? "No participants listed" : interaction.participants.join(", ")}
                    </p>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                      Interaction ID: {interaction.interactionId}
                    </p>
                    <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                      Relationship ID: {interaction.relationshipId}
                    </p>
                    <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                      Source: {interaction.summaryMetadata.sourceSystem}
                    </p>
                    <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                      Reference: {interaction.summaryMetadata.sourceReference}
                    </p>
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
