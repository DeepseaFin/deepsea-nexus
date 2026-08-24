import type { JourneySidebarProps } from "./types";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Placeholder({ label }: { readonly label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </div>
  );
}

export function JourneySidebar({ navigationSlot, className }: JourneySidebarProps) {
  return (
    <aside
      className={withClassName(
        "w-full border-b border-slate-800 bg-[#07111F] p-4 lg:w-80 lg:border-b-0 lg:border-r",
        className,
      )}
    >
      <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Capability Navigation</h2>
        {navigationSlot ?? <Placeholder label="Navigation Placeholder" />}
      </section>
    </aside>
  );
}