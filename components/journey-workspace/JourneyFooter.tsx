import type { JourneyFooterProps } from "./types";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Placeholder({ label }: { readonly label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </div>
  );
}

export function JourneyFooter({
  workflowStateSlot,
  secondaryActionsSlot,
  className,
}: JourneyFooterProps) {
  return (
    <footer className={withClassName("border-t border-slate-800 bg-[#050d18] px-4 py-3", className)}>
      <div className="mx-auto flex w-full max-w-[1700px] flex-wrap items-center justify-between gap-3">
        <div className="min-w-[16rem] flex-1">
          {workflowStateSlot ?? <Placeholder label="Workflow State Placeholder" />}
        </div>
        <div className="min-w-[16rem] flex-1 text-right">
          {secondaryActionsSlot ?? <Placeholder label="Secondary Actions Placeholder" />}
        </div>
      </div>
    </footer>
  );
}