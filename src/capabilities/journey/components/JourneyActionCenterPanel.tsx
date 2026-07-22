import { AlertTriangle, CheckSquare, ClipboardList, FileWarning, ShieldAlert } from "lucide-react";
import type { ComponentType } from "react";

export type ActionCenterGroupKey =
  | "recommendedNextActions"
  | "pendingApprovals"
  | "missingDocuments"
  | "outstandingRisks"
  | "followUpTasks";

export interface ActionCenterItem {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly priority: "high" | "medium" | "low";
}

export type ActionCenterGroups = Readonly<Record<ActionCenterGroupKey, readonly ActionCenterItem[]>>;

type GroupCardProps = {
  readonly title: string;
  readonly items: readonly ActionCenterItem[];
  readonly icon: ComponentType<{ className?: string }>;
};

type JourneyActionCenterPanelProps = {
  readonly groups?: ActionCenterGroups;
  readonly className?: string;
};

const DEFAULT_GROUPS: ActionCenterGroups = {
  recommendedNextActions: [
    {
      id: "rna-1",
      label: "Advance package to approval prep",
      detail: "Prepare the executive summary bundle and route for institutional review readiness.",
      priority: "high",
    },
    {
      id: "rna-2",
      label: "Confirm final evidence reconciliation",
      detail: "Validate that all evidence references align with current journey-stage conclusions.",
      priority: "medium",
    },
  ],
  pendingApprovals: [
    {
      id: "pa-1",
      label: "Compliance checkpoint sign-off",
      detail: "Awaiting compliance acknowledgment before credit-readiness transition.",
      priority: "high",
    },
    {
      id: "pa-2",
      label: "Operations validation endorsement",
      detail: "Operations reviewer to confirm journey artifacts are complete for next stage.",
      priority: "medium",
    },
  ],
  missingDocuments: [
    {
      id: "md-1",
      label: "Board resolution addendum",
      detail: "Outstanding governance addendum required for institutional completeness.",
      priority: "high",
    },
    {
      id: "md-2",
      label: "Counterparty aging attachment",
      detail: "Latest aging support document remains pending in ORACLE intake context.",
      priority: "medium",
    },
  ],
  outstandingRisks: [
    {
      id: "or-1",
      label: "Documentation timing risk",
      detail: "Delays in missing artifacts may impact scheduled approval timeline.",
      priority: "high",
    },
    {
      id: "or-2",
      label: "Validation dependency risk",
      detail: "Final advisory posture depends on closure of remaining institutional checks.",
      priority: "medium",
    },
  ],
  followUpTasks: [
    {
      id: "ft-1",
      label: "Schedule committee pre-read",
      detail: "Distribute summary notes and risk highlights to approval participants.",
      priority: "low",
    },
    {
      id: "ft-2",
      label: "Record journey handoff notes",
      detail: "Capture transition details for continuity into downstream workflow execution.",
      priority: "low",
    },
  ],
};

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function priorityTone(priority: ActionCenterItem["priority"]): string {
  if (priority === "high") {
    return "border-rose-700/40 bg-rose-950/20 text-rose-200";
  }

  if (priority === "medium") {
    return "border-amber-700/40 bg-amber-950/20 text-amber-200";
  }

  return "border-emerald-700/40 bg-emerald-950/20 text-emerald-200";
}

function GroupCard({ title, items, icon: Icon }: GroupCardProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        <Icon className="h-3.5 w-3.5 text-cyan-300" /> {title}
      </h3>

      {items.length === 0 ? (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <p className="text-sm text-slate-400">No items currently available.</p>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-medium leading-relaxed text-slate-200">{item.label}</p>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${priorityTone(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function JourneyActionCenterPanel({
  groups = DEFAULT_GROUPS,
  className,
}: JourneyActionCenterPanelProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)} aria-label="Institutional action center">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Institutional Action Center</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Executive Action Coordination</h2>
          <p className="mt-2 text-sm text-slate-400">Presentation-only action groupings prepared for future workflow-engine replacement.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          Action Placeholder
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-2">
        <GroupCard title="Recommended Next Actions" items={groups.recommendedNextActions} icon={ClipboardList} />
        <GroupCard title="Pending Approvals" items={groups.pendingApprovals} icon={CheckSquare} />
        <GroupCard title="Missing Documents" items={groups.missingDocuments} icon={FileWarning} />
        <GroupCard title="Outstanding Risks" items={groups.outstandingRisks} icon={ShieldAlert} />
        <div className="xl:col-span-2">
          <GroupCard title="Follow-up Tasks" items={groups.followUpTasks} icon={AlertTriangle} />
        </div>
      </div>
    </section>
  );
}