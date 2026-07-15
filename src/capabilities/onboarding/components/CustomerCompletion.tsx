import type { CustomerOnboardingCompletion } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

type CustomerCompletionProps = {
  readonly completion: CustomerOnboardingCompletion;
};

export default function CustomerCompletion({ completion }: CustomerCompletionProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Completion Readiness</h2>
      <div className="mt-3 rounded border border-slate-800 bg-slate-950/60 p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Readiness Score</p>
        <p className="mt-1 text-2xl font-semibold text-emerald-300">{completion.readinessScore}%</p>
        <p className="mt-2 text-sm text-slate-300">Next Handoff: {completion.nextHandoff}</p>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
        {completion.checks.map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
    </section>
  );
}
