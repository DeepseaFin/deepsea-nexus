type CustomerOnboardingProgressProps = {
  readonly completionPercentage: number;
  readonly completedCount: number;
  readonly totalCount: number;
};

export default function CustomerOnboardingProgress({
  completionPercentage,
  completedCount,
  totalCount,
}: CustomerOnboardingProgressProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Progress</h2>
        <p className="text-sm font-medium text-cyan-200">{completionPercentage}%</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${completionPercentage}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-400">{completedCount} of {totalCount} steps completed</p>
    </section>
  );
}
