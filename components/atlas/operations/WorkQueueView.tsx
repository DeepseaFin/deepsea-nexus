import { ListChecks } from "lucide-react";
import Link from "next/link";
import type { WorkQueue } from "@/src/capabilities/operations/workqueue/WorkQueue";

interface WorkQueueViewProps {
  readonly queue: WorkQueue;
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

export default function WorkQueueView({ queue, className }: WorkQueueViewProps) {
  return (
    <section
      className={withClassName(
        "rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]",
        className,
      )}
      aria-label="Work queue"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Work Queue</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Operational Work Queue</h2>
          <p className="mt-2 text-sm text-slate-400">Read-only presentation contract for assignment-driven work.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          <ListChecks className="h-3.5 w-3.5" /> {queue.totalAssignments} Assignments
        </div>
      </header>

      {queue.queueItems.length === 0 ? (
        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-sm font-semibold tracking-tight text-slate-100">{queue.emptyState.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{queue.emptyState.description}</p>
        </section>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {queue.queueItems.map((item) => (
            <Link
              key={item.assignmentId}
              href={`/atlas/opportunity?workflowId=${item.operationId}`}
              className="block rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-700/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{item.assignmentType}</p>
                  <h3 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{item.assigneeName}</h3>
                </div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.status}</p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Field label="Assignment ID" value={item.assignmentId} />
                <Field label="Operation ID" value={item.operationId} />
                <Field label="Assignee Name" value={item.assigneeName} />
                <Field label="Assignment Type" value={item.assignmentType} />
                <Field label="Status" value={item.status} />
                <Field label="Task ID" value={item.taskId ?? "Not assigned to a task"} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}