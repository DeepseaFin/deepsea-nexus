import UICard from "@/components/ui/Card";

export interface ActivityItem {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly timestamp: string;
}

export interface RecentActivityProps {
  readonly items: readonly ActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Recent Activity</h3>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-slate-100">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
              </div>
              <time className="whitespace-nowrap text-xs text-slate-500">{item.timestamp}</time>
            </div>
          </article>
        ))}
      </div>
    </UICard>
  );
}
