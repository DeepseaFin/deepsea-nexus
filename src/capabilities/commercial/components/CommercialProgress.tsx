import type { CommercialWorkflowStep } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type CommercialProgressProps = {
  readonly steps: readonly CommercialWorkflowStep[];
};

export default function CommercialProgress({ steps }: CommercialProgressProps) {
  const completedCount = steps.filter((step) => step.status === "completed").length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Commercial Progress</h2>
        <p className="text-sm font-medium text-cyan-200">{percentage}%</p>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${percentage}%` }} />
      </div>

      <p className="mt-2 text-xs text-slate-400">{completedCount} of {steps.length} stages completed</p>
    </section>
  );
}
