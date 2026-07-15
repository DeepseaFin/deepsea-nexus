import type { CustomerOnboardingStep, CustomerOnboardingStepId } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

type CustomerOnboardingSidebarProps = {
  readonly steps: readonly CustomerOnboardingStep[];
  readonly currentStepId: CustomerOnboardingStepId;
};

function statusTone(status: CustomerOnboardingStep["status"]): string {
  if (status === "completed") return "text-emerald-300 border-emerald-700/40 bg-emerald-950/20";
  if (status === "in_progress") return "text-cyan-200 border-cyan-700/40 bg-cyan-950/20";
  if (status === "blocked") return "text-rose-300 border-rose-700/40 bg-rose-950/20";
  return "text-slate-300 border-slate-700 bg-slate-950/50";
}

export default function CustomerOnboardingSidebar({ steps, currentStepId }: CustomerOnboardingSidebarProps) {
  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Workflow Steps</h2>
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          return (
            <article
              key={step.id}
              className={[
                "rounded border px-3 py-2 text-sm",
                statusTone(step.status),
                isCurrent ? "ring-1 ring-cyan-500/60" : "",
              ].join(" ")}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Step {index + 1}</p>
              <p className="mt-1 font-semibold">{step.title}</p>
              <p className="mt-1 text-xs text-slate-400">{step.owner}</p>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
