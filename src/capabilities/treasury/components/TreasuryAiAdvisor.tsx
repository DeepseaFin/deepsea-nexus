import type { TreasuryAiAdvisorState } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type TreasuryAiAdvisorProps = {
  readonly advisor: TreasuryAiAdvisorState;
};

export default function TreasuryAiAdvisor({ advisor }: TreasuryAiAdvisorProps) {
  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Treasury AI Advisor</h2>
      <p className="mt-2 text-sm text-slate-300">{advisor.summary}</p>

      <div className="mt-4 space-y-3">
        <section>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Recommendations</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-cyan-200">
            {advisor.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Alerts</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-200">
            {advisor.alerts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
