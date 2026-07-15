export default function ExecutiveLoading() {
  return (
    <div className="min-h-[60vh] p-6 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="h-8 w-72 animate-pulse rounded bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-xl border border-slate-800 bg-slate-900/60" />
          <div className="h-28 animate-pulse rounded-xl border border-slate-800 bg-slate-900/60" />
          <div className="h-28 animate-pulse rounded-xl border border-slate-800 bg-slate-900/60" />
        </div>
        <p className="text-sm text-slate-400">Loading executive workspace...</p>
      </div>
    </div>
  );
}
