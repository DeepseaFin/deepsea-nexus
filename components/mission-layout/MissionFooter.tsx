import type { MissionFooterProps } from "./types";

function toClassName(className?: string): string {
  return className ? ` ${className}` : "";
}

function Placeholder({ label }: { readonly label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </div>
  );
}

export function MissionFooter({
  workspaceStatusSlot,
  secondaryActionsSlot,
  className,
}: MissionFooterProps) {
  return (
    <footer className={`border-t border-slate-800 bg-[#050d18] px-4 py-3${toClassName(className)}`}>
      <div className="mx-auto flex w-full max-w-[1700px] flex-wrap items-center justify-between gap-3">
        <div className="min-w-[16rem] flex-1">
          {workspaceStatusSlot ?? <Placeholder label="Workspace Status Placeholder" />}
        </div>
        <div className="min-w-[16rem] flex-1 text-right">
          {secondaryActionsSlot ?? <Placeholder label="Secondary Actions Placeholder" />}
        </div>
      </div>
    </footer>
  );
}