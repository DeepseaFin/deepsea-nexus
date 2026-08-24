export type OpportunityItem = {
  id: string;
  client: string;
  counterparty: string;
  dealType: string;
  requestedAmount: string;
  relationshipManager: string;
  currentStage: string;
  sla: string;
  riskRating: 'Low' | 'Medium' | 'High';
};

type OpportunityListProps = {
  opportunities: OpportunityItem[];
};

function riskTone(risk: OpportunityItem['riskRating']): string {
  if (risk === 'Low') return 'border-emerald-700/40 bg-emerald-950/25 text-emerald-200';
  if (risk === 'Medium') return 'border-amber-700/40 bg-amber-950/25 text-amber-200';
  return 'border-rose-700/40 bg-rose-950/25 text-rose-200';
}

export default function OpportunityList({ opportunities }: OpportunityListProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Opportunity List</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
          {opportunities.length} Active
        </span>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">Client</th>
              <th className="px-3 py-2 font-semibold">Counterparty</th>
              <th className="px-3 py-2 font-semibold">Deal Type</th>
              <th className="px-3 py-2 font-semibold">Requested Amount</th>
              <th className="px-3 py-2 font-semibold">Relationship Manager</th>
              <th className="px-3 py-2 font-semibold">Current Stage</th>
              <th className="px-3 py-2 font-semibold">SLA</th>
              <th className="px-3 py-2 font-semibold">Risk Rating</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((item) => (
              <tr key={item.id} className="border-t border-slate-800/90">
                <td className="px-3 py-2 text-slate-100">{item.client}</td>
                <td className="px-3 py-2 text-slate-300">{item.counterparty}</td>
                <td className="px-3 py-2 text-slate-300">{item.dealType}</td>
                <td className="px-3 py-2 text-slate-300">{item.requestedAmount}</td>
                <td className="px-3 py-2 text-slate-300">{item.relationshipManager}</td>
                <td className="px-3 py-2 text-slate-300">{item.currentStage}</td>
                <td className="px-3 py-2 text-slate-300">{item.sla}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${riskTone(item.riskRating)}`}>
                    {item.riskRating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
