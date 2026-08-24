import AIInsightCard from "@/components/ui/AIInsightCard";
import UICard from "@/components/ui/Card";

export interface AIInsightItem {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly confidence: number;
  readonly tags?: readonly string[];
}

export interface AIInsightsPanelProps {
  readonly title?: string;
  readonly insights: readonly AIInsightItem[];
}

export default function AIInsightsPanel({ title = "AI Recommendations", insights }: AIInsightsPanelProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">{title}</h3>
      <div className="mt-4 grid gap-3">
        {insights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            title={insight.title}
            summary={insight.summary}
            confidence={insight.confidence}
            tags={insight.tags}
          />
        ))}
      </div>
    </UICard>
  );
}
