type KpiItem = {
  label: string;
  value: string;
  tone: string;
};

type TopKpiCardsProps = {
  items: KpiItem[];
};

export default function TopKpiCards({ items }: TopKpiCardsProps) {
  return (
    <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
        </article>
      ))}
    </section>
  );
}
