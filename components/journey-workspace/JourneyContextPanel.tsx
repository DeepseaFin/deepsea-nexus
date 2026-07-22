import type { JourneyContextPanelProps } from "./types";

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

export function JourneyContextPanel({
  evidenceSlot,
  knowledgeSlot,
  advisorSlot,
  timelineSlot,
  className,
}: JourneyContextPanelProps) {
  return (
    <aside className={withClassName("space-y-3", className)}>
      <Section title="Evidence">
        {evidenceSlot ?? <Placeholder label="Evidence Placeholder" />}
      </Section>

      <Section title="Knowledge">
        {knowledgeSlot ?? <Placeholder label="Knowledge Placeholder" />}
      </Section>

      <Section title="Institutional Advisor">
        {advisorSlot ?? <Placeholder label="Institutional Advisor Placeholder" />}
      </Section>

      <Section title="Timeline">
        {timelineSlot ?? <Placeholder label="Timeline Placeholder" />}
      </Section>
    </aside>
  );
}