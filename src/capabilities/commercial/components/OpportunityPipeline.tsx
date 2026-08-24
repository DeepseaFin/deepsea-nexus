import type { CommercialOpportunity } from "@/src/capabilities/commercial/types/CommercialWorkspaceState";

type OpportunityPipelineProps = {
  readonly opportunities: readonly CommercialOpportunity[];
};

export default function OpportunityPipeline({ opportunities }: OpportunityPipelineProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Opportunity Pipeline</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-3 py-2">Counterparty</th>
              <th className="px-3 py-2">Facility</th>
              <th className="px-3 py-2">Notional</th>
              <th className="px-3 py-2">Stage</th>
              <th className="px-3 py-2">Owner</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="border-t border-slate-800/80">
                <td className="px-3 py-2 font-medium text-slate-100">{opportunity.counterparty}</td>
                <td className="px-3 py-2">{opportunity.facilityType}</td>
                <td className="px-3 py-2">{opportunity.notional}</td>
                <td className="px-3 py-2 text-cyan-300">{opportunity.stage}</td>
                <td className="px-3 py-2 text-slate-400">{opportunity.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
