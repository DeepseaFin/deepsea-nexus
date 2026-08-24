export interface AIConfidenceBadgeProps {
  readonly score: number;
  readonly label?: string;
}

function tone(score: number): "text-emerald-200" | "text-amber-200" | "text-rose-200" {
  if (score >= 80) {
    return "text-emerald-200";
  }

  if (score >= 60) {
    return "text-amber-200";
  }

  return "text-rose-200";
}

export default function AIConfidenceBadge({ score, label = "Confidence" }: AIConfidenceBadgeProps) {
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-700/50 bg-cyan-950/20 px-3 py-1.5 text-xs">
      <span className="uppercase tracking-[0.12em] text-cyan-200">{label}</span>
      <span className={`font-semibold ${tone(clamped)}`}>{clamped}%</span>
    </div>
  );
}
