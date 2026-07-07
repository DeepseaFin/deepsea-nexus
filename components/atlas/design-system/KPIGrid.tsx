'use client';

export type KPIItem = {
  label: string;
  value: string;
  note?: string;
};

export default function KPIGrid({ items }: { items: KPIItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{item.value}</p>
          {item.note ? <p className="mt-1 text-xs text-slate-400">{item.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
