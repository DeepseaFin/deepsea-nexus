import type { BankAccountItem } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type BankAccountsProps = {
  readonly items: readonly BankAccountItem[];
};

export default function BankAccounts({ items }: BankAccountsProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Bank Accounts</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.accountName}</p>
            <p className="mt-1 text-xs text-slate-400">{item.bank} · {item.currency}</p>
            <p className="mt-1 text-xs text-slate-400">Balance: {item.balance}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
