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

function toEventTypeTone(event: WorkflowEvent): string {
  if (event.type === WorkflowEventType.OpportunityLifecycleTransitioned) {
    const lifecycleEvent = event as OpportunityLifecycleAuditEvent;
    return lifecycleEvent.previousLifecycle === lifecycleEvent.currentLifecycle
      ? "border-slate-700/70 bg-slate-900 text-slate-200"
      : "border-cyan-700/50 bg-cyan-950/30 text-cyan-200";
  }

  if (event.type === WorkflowEventType.StepFailed || event.type === WorkflowEventType.ExecutionFailed) {
    return "border-rose-700/50 bg-rose-950/30 text-rose-200";
  }

  if (event.type === WorkflowEventType.StepCompleted || event.type === WorkflowEventType.ExecutionCompleted) {
    return "border-emerald-700/50 bg-emerald-950/30 text-emerald-200";
  }

  return "border-slate-700/70 bg-slate-900 text-slate-200";
}

function toEventTypeLabel(event: WorkflowEvent): string {
  if (event.type === WorkflowEventType.OpportunityLifecycleTransitioned) {
    return "Lifecycle";
  }

  return event.type.replaceAll("_", " ");
}

function formatOccurredAt(value: string): string {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return value;
  }

  return new Date(parsed).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WorkflowTimelinePanel({
  events,
  title = "Workflow Timeline",
  compact = false,
  variant = "dark",
}: WorkflowTimelinePanelProps) {
  const cardClassName = variant === "dark"
    ? "rounded-2xl border border-slate-800/90 bg-slate-900/50 p-5 shadow-[0_12px_32px_rgba(2,6,23,0.26)]"
    : "rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8";

  const titleClassName = variant === "dark"
    ? "text-lg font-semibold tracking-tight text-slate-100"
    : "text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl";

  const itemClassName = variant === "dark"
    ? "relative rounded-xl border border-slate-800 bg-slate-950/70 p-4"
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
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <h2 className={titleClassName}>{title}</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
          {visibleEvents.length} events
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {visibleEvents.length === 0 ? (
          <EmptyState
            title="No timeline events"
            message="Workflow events will appear here as processing progresses."
          />
        ) : null}
        {visibleEvents.map((event) => (
          <article key={event.eventId} className={itemClassName}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${toEventTypeTone(event)}`}>
                    {toEventTypeLabel(event)}
                  </span>
                </div>
                <p className={labelClassName}>{toEventLabel(event)}</p>
                <p className={messageClassName}>{toMessage(event)}</p>
              </div>
              <p className={timestampClassName}>{formatOccurredAt(event.occurredAt)}</p>
            </div>
            <p className={actorClassName}>{event.actorId}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
