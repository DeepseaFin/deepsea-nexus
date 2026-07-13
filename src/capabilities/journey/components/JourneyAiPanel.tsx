import type { JourneyRecommendation } from "@/lib/journey";

type JourneyAiPanelProps = {
  recommendations: readonly JourneyRecommendation[];
  missingItems: readonly string[];
  nextAction: string;
};

function priorityTone(priority: JourneyRecommendation["priority"]): string {
  if (priority === "critical") return "border-rose-700/40 bg-rose-950/25 text-rose-200";
  if (priority === "high") return "border-amber-700/40 bg-amber-950/25 text-amber-200";
  if (priority === "medium") return "border-cyan-700/40 bg-cyan-950/25 text-cyan-200";
  return "border-slate-700/50 bg-slate-900 text-slate-300";
}

export default function JourneyAiPanel({ recommendations, missingItems, nextAction }: JourneyAiPanelProps) {
  return (
    <aside className="space-y-2 xl:w-[360px]">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="text-lg font-semibold text-slate-100">NEXUS AI</h2>

        <div className="mt-3 space-y-4 text-sm">
          <div>
            <p className="mb-1 font-semibold text-cyan-200">Recommendations</p>
            <div className="space-y-2">
              {recommendations.map((item) => (
                <article key={`${item.title}-${item.generatedAt}`} className={`rounded border px-2 py-2 ${priorityTone(item.priority)}`}>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-xs opacity-90">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 font-semibold text-amber-200">Missing Items</p>
            <div className="space-y-1 text-slate-300">
              {missingItems.map((item) => (
                <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">{item}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 font-semibold text-emerald-200">Next Action</p>
            <p className="rounded border border-emerald-700/40 bg-emerald-950/20 px-2 py-2 text-emerald-100">{nextAction}</p>
          </div>
        </div>
      </section>
    </aside>
  );
}