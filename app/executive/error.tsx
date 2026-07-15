"use client";

export default function ExecutiveError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] p-6 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-rose-800/50 bg-rose-950/20 p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-rose-300">Executive Workspace Error</p>
        <h2 className="mt-2 text-xl font-semibold text-rose-100">Unable to load executive state</h2>
        <p className="mt-2 text-sm text-rose-200/90">
          {error.message || "An unexpected issue occurred while preparing executive data."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded border border-rose-700/50 bg-rose-900/30 px-3 py-2 text-sm font-medium text-rose-100"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
