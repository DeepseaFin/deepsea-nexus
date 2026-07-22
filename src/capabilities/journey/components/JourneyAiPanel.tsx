import { type JourneyRecommendation, type JourneyStatus } from "@/lib/journey";

type JourneyAiPanelProps = {
  recommendations: readonly JourneyRecommendation[];
  missingItems: readonly string[];
  nextAction: string;
  status: JourneyStatus;
};

function priorityTone(priority: JourneyRecommendation["priority"]): string {
  if (priority === "critical") return "border-rose-700/40 bg-rose-950/25 text-rose-200";
  if (priority === "high") return "border-amber-700/40 bg-amber-950/25 text-amber-200";
  if (priority === "medium") return "border-cyan-700/40 bg-cyan-950/25 text-cyan-200";
  return "border-slate-700/50 bg-slate-900 text-slate-300";
}

export default function JourneyAiPanel({ recommendations, missingItems, nextAction, status }: JourneyAiPanelProps) {
  return (
    <aside className="space-y-2 xl:w-[360px]">
      <section className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))] p-5 shadow-[0_14px_28px_rgba(2,6,23,0.2)] sm:p-6" aria-label="Journey advisory panel">
        <header className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">NEXUS AI</h2>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-slate-300">
            {status}
          </span>
        </header>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="mb-1 font-semibold text-cyan-200">Recommendations</h3>
            <div className="space-y-2">
              {recommendations.length === 0 ? (
                <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-2 text-slate-400">No recommendations are currently available.</p>
              ) : (
                recommendations.map((item) => (
                  <article key={`${item.title}-${item.generatedAt}`} className={`rounded border px-2 py-2 ${priorityTone(item.priority)}`}>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-xs opacity-90">{item.description}</p>
                  </article>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-amber-200">Missing Items</h3>
            <div className="space-y-1 text-slate-300">
              {missingItems.length === 0 && (
                <p className="rounded border border-emerald-700/40 bg-emerald-950/20 px-2 py-1 text-emerald-200">No missing items.</p>
              )}
              {missingItems.map((item) => (
                <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">{item}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-emerald-200">Next Action</h3>
            <p className="rounded border border-emerald-700/40 bg-emerald-950/20 px-2 py-2 text-emerald-100">{nextAction}</p>
          </div>
        </div>
      </section>
    </aside>
  );
}