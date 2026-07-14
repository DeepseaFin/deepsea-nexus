type WizardHeaderProps = {
  institutionName: string;
  currentStepTitle: string;
};

export default function WizardHeader({ institutionName, currentStepTitle }: WizardHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / INSTITUTION WIZARD</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">Institution Onboarding Wizard</h1>
        </div>

        <div className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
          <p className="uppercase tracking-[0.14em] text-slate-500">Institution</p>
          <p className="mt-1 font-semibold text-slate-200">{institutionName}</p>
          <p className="mt-1 text-cyan-200">{currentStepTitle}</p>
        </div>
      </div>
    </header>
  );
}