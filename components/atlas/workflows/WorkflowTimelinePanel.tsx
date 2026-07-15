import {
  WorkflowEventType,
  type OpportunityLifecycleAuditEvent,
  type WorkflowEvent,
} from "@/lib/workflows/WorkflowEvent";
import EmptyState from "@/components/atlas/design-system/EmptyState";

type WorkflowTimelinePanelProps = {
  readonly events: readonly WorkflowEvent[];
  readonly title?: string;
  readonly compact?: boolean;
  readonly variant?: "dark" | "light";
};

function toEventLabel(event: WorkflowEvent): string {
  if (event.type === WorkflowEventType.OpportunityLifecycleTransitioned) {
    const lifecycleEvent = event as OpportunityLifecycleAuditEvent;
    return `${lifecycleEvent.previousLifecycle} to ${lifecycleEvent.currentLifecycle}`;
  }

  return event.metadata.eventLabel ?? event.message ?? event.type;
}

function toMessage(event: WorkflowEvent): string {
  return event.message ?? "Workflow event recorded.";
}

export default function WorkflowTimelinePanel({
  events,
  title = "Workflow Timeline",
  compact = false,
  variant = "dark",
}: WorkflowTimelinePanelProps) {
  const cardClassName = variant === "dark"
    ? "rounded-lg border border-slate-800 bg-slate-900/40 p-4"
    : "rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8";

  const titleClassName = variant === "dark"
    ? "text-lg font-semibold text-slate-100"
    : "text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl";

  const itemClassName = variant === "dark"
    ? "rounded border border-slate-800 bg-slate-950/60 p-3"
    : "rounded-2xl border border-slate-200 bg-slate-50 p-4";

  const labelClassName = variant === "dark"
    ? "text-sm font-semibold text-slate-100"
    : "text-sm font-semibold text-slate-900";

  const messageClassName = variant === "dark"
    ? "mt-1 text-xs text-slate-400"
    : "mt-1 text-xs text-slate-600";

  const timestampClassName = variant === "dark"
    ? "text-xs text-slate-500"
    : "text-xs text-slate-500";

  const actorClassName = variant === "dark"
    ? "mt-2 text-xs uppercase tracking-[0.12em] text-cyan-300"
    : "mt-2 text-xs uppercase tracking-[0.12em] text-cyan-700";

  const visibleEvents = compact ? events.slice(-5) : events;

  return (
    <section className={cardClassName}>
      <h2 className={titleClassName}>{title}</h2>
      <div className="mt-3 space-y-2">
        {visibleEvents.length === 0 ? (
          <EmptyState
            title="No timeline events"
            message="Workflow events will appear here as processing progresses."
          />
        ) : null}
        {visibleEvents.map((event) => (
          <article key={event.eventId} className={itemClassName}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={labelClassName}>{toEventLabel(event)}</p>
                <p className={messageClassName}>{toMessage(event)}</p>
              </div>
              <p className={timestampClassName}>{event.occurredAt}</p>
            </div>
            <p className={actorClassName}>{event.actorId}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
