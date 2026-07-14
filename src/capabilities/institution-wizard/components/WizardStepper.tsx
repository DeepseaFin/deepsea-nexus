import type { WizardStepDefinition } from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";

type WizardStepperProps = {
  steps: readonly WizardStepDefinition[];
  currentStepId: number;
  onStepSelect: (stepId: number) => void;
};

export default function WizardStepper({ steps, currentStepId, onStepSelect }: WizardStepperProps) {
  return (
    <aside className="space-y-2">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">Wizard Steps</h2>
        <div className="mt-3 space-y-2">
          {steps.map((step) => {
            const isCurrent = step.id === currentStepId;
            const isComplete = step.id < currentStepId;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepSelect(step.id)}
                className={`w-full rounded border px-3 py-2 text-left ${
                  isCurrent
                    ? "border-cyan-700/70 bg-cyan-950/25 text-cyan-100"
                    : isComplete
                      ? "border-emerald-700/40 bg-emerald-950/20 text-emerald-200"
                      : "border-slate-800 bg-slate-950/70 text-slate-300"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.14em] opacity-80">Step {step.id}</p>
                <p className="mt-1 text-sm font-medium">{step.title}</p>
                <p className="mt-1 text-xs opacity-80">{step.subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}