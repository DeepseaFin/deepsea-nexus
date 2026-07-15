import Link from "next/link";
import type { ReceivableQueueItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type ReceivableQueueProps = {
  readonly items: readonly ReceivableQueueItem[];
  readonly selectedItemId?: string;
};

export default function ReceivableQueue({ items, selectedItemId }: ReceivableQueueProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Receivable Queue</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-3 py-2">Obligor</th>
              <th className="px-3 py-2">Exporter</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Tenor</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={["border-t border-slate-800/80", item.id === selectedItemId ? "bg-cyan-950/20" : ""].join(" ")}>
                <td className="px-3 py-2 font-medium text-slate-100">
                  {item.itemHref ? (
                    <Link href={item.itemHref} className="text-cyan-300 hover:text-cyan-200">
                      {item.obligor}
                    </Link>
                  ) : (
                    item.obligor
                  )}
                </td>
                <td className="px-3 py-2">{item.exporter}</td>
                <td className="px-3 py-2">{item.amount}</td>
                <td className="px-3 py-2">{item.tenorDays}d</td>
                <td className="px-3 py-2 uppercase tracking-[0.1em] text-cyan-300">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
