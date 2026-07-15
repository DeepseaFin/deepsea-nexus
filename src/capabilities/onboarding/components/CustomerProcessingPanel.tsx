import type { CustomerProcessingTask } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

type CustomerProcessingPanelProps = {
  readonly tasks: readonly CustomerProcessingTask[];
};

function tone(status: CustomerProcessingTask["status"]): string {
  if (status === "ready") return "text-emerald-300";
  if (status === "running") return "text-cyan-300";
  return "text-amber-300";
}

export default function CustomerProcessingPanel({ tasks }: CustomerProcessingPanelProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Processing Panel</h2>
      <div className="mt-3 space-y-2">
        {tasks.map((task) => (
          <article key={task.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">{task.title}</p>
              <p className={["text-xs font-semibold uppercase tracking-[0.12em]", tone(task.status)].join(" ")}>{task.status}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Queue: {task.queue}</p>
            <p className="mt-1 text-xs text-slate-500">ETA: {task.eta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
