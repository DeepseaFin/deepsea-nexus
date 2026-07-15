import type { SettlementQueueItem } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type SettlementQueueProps = {
  readonly items: readonly SettlementQueueItem[];
};

export default function SettlementQueue({ items }: SettlementQueueProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Settlement Queue</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-2">Instruction</th>
              <th className="px-3 py-2">Value Date</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-800/80">
                <td className="px-3 py-2 font-medium text-slate-100">{item.instructionRef}</td>
                <td className="px-3 py-2">{item.valueDate}</td>
                <td className="px-3 py-2">{item.amount}</td>
                <td className="px-3 py-2 uppercase tracking-[0.1em] text-cyan-300">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
