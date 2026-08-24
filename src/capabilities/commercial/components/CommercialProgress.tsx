import type { CommercialWorkflowStep } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type CommercialProgressProps = {
  readonly steps: readonly CommercialWorkflowStep[];
};

export default function CommercialProgress({ steps }: CommercialProgressProps) {
  const completedCount = steps.filter((step) => step.status === "completed").length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Workflow Health</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-100">Commercial Progress</h2>
        </div>
        <p className="text-2xl font-semibold tracking-tight text-cyan-200">{percentage}%</p>
      </div>

      <div className="mt-4 h-2.5 rounded-full bg-slate-800">
        <div className="h-2.5 rounded-full bg-cyan-500" style={{ width: `${percentage}%` }} />
      </div>

      <p className="mt-3 text-xs text-slate-400">{completedCount} of {steps.length} stages completed</p>
    </section>
  );
}
