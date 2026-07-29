import UICard from "@/components/ui/Card";

export interface ActivitySummaryItem {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly time: string;
}

export interface ActivitySummaryProps {
  readonly items: readonly ActivitySummaryItem[];
}

export default function ActivitySummary({ items }: ActivitySummaryProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Activity Summary</h3>
      <div className="mt-4 space-y-2.5">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-slate-100">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
              </div>
              <time className="whitespace-nowrap text-xs text-slate-500">{item.time}</time>
            </div>
          </article>
        ))}
      </div>
    </UICard>
  );
}
