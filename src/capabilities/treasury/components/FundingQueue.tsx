import Link from "next/link";
import type { FundingQueueItem } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type FundingQueueProps = {
  readonly items: readonly FundingQueueItem[];
  readonly selectedItemId?: string;
};

export default function FundingQueue({
  items,
  selectedItemId,
}: FundingQueueProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Funding Queue</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article
            key={item.id}
            className={[
              "rounded border bg-slate-950/60 p-3",
              item.id === selectedItemId ? "border-cyan-700/60" : "border-slate-800",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              {item.itemHref ? (
                <Link href={item.itemHref} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  {item.counterparty}
                </Link>
              ) : (
                <p className="text-sm font-semibold text-slate-100">{item.counterparty}</p>
              )}
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">{item.currentStatus ?? item.status}</p>
            </div>
            {item.opportunityReference && <p className="mt-1 text-xs text-slate-400">Opportunity: {item.opportunityReference}</p>}
            <p className="mt-1 text-xs text-slate-400">Amount: {item.amount}</p>
            {item.currency && <p className="mt-1 text-xs text-slate-400">Currency: {item.currency}</p>}
            {item.fundingDate && <p className="mt-1 text-xs text-slate-400">Funding Date: {item.fundingDate}</p>}
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-500">Priority: {item.priority}</p>
            {item.releaseHref && (
              <div className="mt-3">
                <Link href={item.releaseHref} className="inline-flex rounded border border-cyan-700/40 bg-cyan-950/20 px-2 py-1 text-xs font-medium text-cyan-100">
                  Release for Purchase →
                </Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
