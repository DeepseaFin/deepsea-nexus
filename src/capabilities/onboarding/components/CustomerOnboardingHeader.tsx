import type { CustomerOnboardingState } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

type CustomerOnboardingHeaderProps = {
  readonly onboarding: CustomerOnboardingState;
  readonly completionPercentage: number;
};

export default function CustomerOnboardingHeader({ onboarding, completionPercentage }: CustomerOnboardingHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / ONBOARDING</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">Customer Onboarding Workspace</h1>
          <p className="mt-1 text-sm text-slate-400">{onboarding.customerName} · {onboarding.institutionName}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Onboarding</p>
            <p className="mt-1 font-semibold text-slate-200">{onboarding.onboardingId}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Initiated</p>
            <p className="mt-1 font-semibold text-slate-200">{onboarding.initiatedAt}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Status</p>
            <p className="mt-1 font-semibold text-cyan-200">{onboarding.status}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Completion</p>
            <p className="mt-1 font-semibold text-emerald-200">{completionPercentage}%</p>
          </div>
        </div>
      </div>
    </header>
  );
}
