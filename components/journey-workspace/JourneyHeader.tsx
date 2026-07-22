import type { JourneyHeaderProps } from "./types";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Placeholder({ label }: { readonly label: string }) {
  return (
    <div className="inline-flex min-h-10 min-w-[10rem] items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/70 px-3 text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </div>
  );
}

export function JourneyHeader({
  journeyTitle,
  journeySubtitle,
  heartbeatSlot,
  confidenceSlot,
  primaryActionsSlot,
  className,
}: JourneyHeaderProps) {
  return (
    <header
      className={withClassName(
        "sticky top-0 z-30 border-b border-slate-800 bg-[#050d18]/95 px-4 py-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Journey Workspace</p>
          <h1 className="mt-1 truncate text-xl font-semibold text-slate-100">{journeyTitle}</h1>
          {journeySubtitle ? <p className="mt-1 truncate text-sm text-slate-400">{journeySubtitle}</p> : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {heartbeatSlot ?? <Placeholder label="Heartbeat Placeholder" />}
          {confidenceSlot ?? <Placeholder label="Confidence Placeholder" />}
          {primaryActionsSlot ?? <Placeholder label="Primary Actions Placeholder" />}
        </div>
      </div>
    </header>
  );
}