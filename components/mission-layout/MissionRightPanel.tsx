import type { MissionRightPanelProps } from "./types";

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

function PanelSection({
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

export function MissionRightPanel({
  contextSlot,
  recommendationsSlot,
  timelineSlot,
  supportingInfoSlot,
  className,
}: MissionRightPanelProps) {
  return (
    <aside className={`space-y-3${toClassName(className)}`}>
      <PanelSection title="Context">
        {contextSlot ?? <Placeholder label="Context Placeholder" />}
      </PanelSection>

      <PanelSection title="Recommendations">
        {recommendationsSlot ?? <Placeholder label="Recommendations Placeholder" />}
      </PanelSection>

      <PanelSection title="Timeline">
        {timelineSlot ?? <Placeholder label="Timeline Placeholder" />}
      </PanelSection>

      <PanelSection title="Supporting Information">
        {supportingInfoSlot ?? <Placeholder label="Supporting Information Placeholder" />}
      </PanelSection>
    </aside>
  );
}