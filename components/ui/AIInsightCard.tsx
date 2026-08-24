import UICard from "@/components/ui/Card";
import AIConfidenceBadge from "@/components/ui/AIConfidenceBadge";

export interface AIInsightCardProps {
  readonly title: string;
  readonly summary: string;
  readonly confidence: number;
  readonly tags?: readonly string[];
}

export default function AIInsightCard({ title, summary, confidence, tags = [] }: AIInsightCardProps) {
  return (
    <UICard variant="ai" interactive>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        <AIConfidenceBadge score={confidence} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{summary}</p>
      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-cyan-700/40 px-2.5 py-1 text-[11px] text-cyan-200">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </UICard>
  );
}
