import type { CustomerOnboardingStep as CustomerOnboardingStepModel } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

type CustomerOnboardingStepProps = {
  readonly step: CustomerOnboardingStepModel;
};

export default function CustomerOnboardingStep({ step }: CustomerOnboardingStepProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Current Step</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-100">{step.title}</h2>
      <p className="mt-2 text-sm text-slate-300">{step.description}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Owner</p>
          <p className="mt-1 text-sm font-semibold text-slate-200">{step.owner}</p>
        </div>
        <div className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</p>
          <p className="mt-1 text-sm font-semibold text-cyan-200">{step.status}</p>
        </div>
      </div>
    </section>
  );
}
