import type { MissionSidebarProps } from "./types";

function toClassName(className?: string): string {
  return className ? ` ${className}` : "";
}

function Placeholder({ label }: { readonly label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

export function MissionSidebar({
  navigationSlot,
  filtersSlot,
  categoriesSlot,
  className,
}: MissionSidebarProps) {
  return (
    <aside
      className={`w-full border-b border-slate-800 bg-[#07111F] p-4 lg:w-80 lg:border-b-0 lg:border-r${toClassName(className)}`}
    >
      <div className="space-y-3">
        <Section title="Mission Navigation">
          {navigationSlot ?? <Placeholder label="Navigation Placeholder" />}
        </Section>

        <Section title="Filters">
          {filtersSlot ?? <Placeholder label="Filters Placeholder" />}
        </Section>

        <Section title="Categories">
          {categoriesSlot ?? <Placeholder label="Categories Placeholder" />}
        </Section>
      </div>
    </aside>
  );
}