import type { MissionFocusCardProps } from "./types";
import type { ReactNode } from "react";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Item({
  label,
  value,
}: {
  readonly label: string;
  readonly value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

export function MissionFocusCard({
  missionTitle = "Highest-Priority Mission Placeholder",
  heartbeat = "Mission Heartbeat Placeholder",
  confidence = "Confidence Placeholder",
  owner = "Owner Placeholder",
  nextMilestone = "Next Milestone Placeholder",
  className,
}: MissionFocusCardProps) {
  return (
    <section className={withClassName("space-y-4 rounded-xl border border-cyan-900/40 bg-slate-950/70 p-4", className)}>
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-400">Mission Focus</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-100">{missionTitle}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Item label="Heartbeat" value={heartbeat} />
        <Item label="Confidence" value={confidence} />
        <Item label="Owner" value={owner} />
        <Item label="Next Milestone" value={nextMilestone} />
      </div>
    </section>
  );
}