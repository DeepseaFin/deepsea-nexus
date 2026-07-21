import type { MissionContentProps } from "./types";

function toClassName(className?: string): string {
  return className ? ` ${className}` : "";
}

export function MissionContent({ children, className }: MissionContentProps) {
  return (
    <main className={`min-h-[32rem] rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6${toClassName(className)}`}>
      <div className="h-full w-full">{children}</div>
    </main>
  );
}