import type { JourneyCanvasProps } from "./types";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export function JourneyCanvas({ children, className }: JourneyCanvasProps) {
  return (
    <main className={withClassName("min-h-[32rem] rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6", className)}>
      <div className="h-full w-full">{children}</div>
    </main>
  );
}