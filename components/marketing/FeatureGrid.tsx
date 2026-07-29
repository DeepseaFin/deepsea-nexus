import Card from "@/components/Card";

export interface FeatureCardItem {
  readonly title: string;
  readonly description: string;
  readonly detail?: string;
}

export interface FeatureGridProps {
  readonly title: string;
  readonly description: string;
  readonly items: readonly FeatureCardItem[];
}

export default function FeatureGrid({ title, description, items }: FeatureGridProps) {
  return (
    <section className="space-y-6">
      <header className="max-w-3xl">
        <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
            {item.detail ? <p className="mt-4 text-xs uppercase tracking-[0.14em] text-cyan-300">{item.detail}</p> : null}
          </Card>
        ))}
      </div>
    </section>
  );
}
