import { Clock3 } from "lucide-react";
import type { TimelinePanel } from "@/src/capabilities/operations/timeline/TimelinePanel";

interface TimelinePanelViewProps {
  readonly panel: TimelinePanel;
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Field({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-200">{value}</p>
    </article>
  );
}

export default function TimelinePanelView({ panel, className }: TimelinePanelViewProps) {
  return (
    <section
      className={withClassName(
        "rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]",
        className,
      )}
      aria-label="Timeline panel"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Timeline Panel</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Operational Timeline Events</h2>
          <p className="mt-2 text-sm text-slate-400">Read-only presentation layer for chronological operational events.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          <Clock3 className="h-3.5 w-3.5" /> {panel.events.length} Events
        </div>
      </header>

      {panel.events.length === 0 ? (
        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-sm font-semibold tracking-tight text-slate-100">{panel.emptyState.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{panel.emptyState.description}</p>
        </section>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {panel.events.map((event) => (
            <article key={event.timelineEventId} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{event.eventType}</p>
                  <h3 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{event.title}</h3>
                </div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{event.occurredAt}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{event.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Field label="Timeline Event ID" value={event.timelineEventId} />
                <Field label="Operation ID" value={event.operationId} />
                <Field label="Actor" value={event.actor} />
                <Field label="Occurred At" value={event.occurredAt} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h4 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Summary Metadata</h4>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <p className="text-xs text-slate-300">Source System: {event.summaryMetadata.sourceSystem}</p>
                  <p className="text-xs text-slate-300">Source Reference: {event.summaryMetadata.sourceReference}</p>
                  <p className="text-xs text-slate-300">Tag Count: {event.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attribute Count: {event.summaryMetadata.attributeCount}</p>
                </div>
              </section>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}