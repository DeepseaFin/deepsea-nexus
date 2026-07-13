type JourneyActionBarProps = {
  actions: readonly string[];
  isPaused: boolean;
  onActionSelect: () => void;
};

export default function JourneyActionBar({ actions, isPaused, onActionSelect }: JourneyActionBarProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Actions</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
          {isPaused ? "Paused" : "Active"}
        </span>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={onActionSelect}
            disabled={isPaused}
            className="rounded border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-left text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-900/30 disabled:opacity-50"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}