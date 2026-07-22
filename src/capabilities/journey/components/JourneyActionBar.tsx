type JourneyActionBarProps = {
  actions: readonly string[];
  isPaused: boolean;
  onActionSelect: () => void;
};

export default function JourneyActionBar({ actions, isPaused, onActionSelect }: JourneyActionBarProps) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))] p-5 shadow-[0_14px_28px_rgba(2,6,23,0.2)] sm:p-6" aria-label="Journey actions">
      <header className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">Actions</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
          {isPaused ? "Paused" : "Active"}
        </span>
      </header>

      {actions.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">No actions are currently available.</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Placeholder state</p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={onActionSelect}
              disabled={isPaused}
              aria-label={`Select action ${action}`}
              className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-left text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}