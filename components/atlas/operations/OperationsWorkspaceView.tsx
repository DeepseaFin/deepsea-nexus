import AssignmentPanelView from "@/components/atlas/operations/AssignmentPanelView";
import ActivityFeedView from "@/components/atlas/operations/ActivityFeedView";
import WorkQueueView from "@/components/atlas/operations/WorkQueueView";
import TimelinePanelView from "@/components/atlas/operations/TimelinePanelView";
import type { AssignmentPanel } from "@/src/capabilities/operations/assignment/AssignmentPanel";
import type { OperationsWorkspace } from "@/src/capabilities/operations/workspace/OperationsWorkspace";

interface OperationsWorkspaceViewProps {
  readonly workspace: OperationsWorkspace;
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Field({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-200">{value}</p>
    </article>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function toAssignmentPanel(workspace: OperationsWorkspace): AssignmentPanel {
  return {
    assignments: workspace.assignments,
    emptyState: {
      title: "No assignments",
      description: "Assignments will appear here once operational ownership is available.",
    },
  };
}

export default function OperationsWorkspaceView({
  workspace,
  className,
}: OperationsWorkspaceViewProps) {
  const { operation } = workspace;

  return (
    <section
      className={withClassName(
        "rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]",
        className,
      )}
      aria-label="Operations workspace"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <SectionTitle
          eyebrow="Operations Workspace"
          title="Operational Execution Summary"
          description="Foundational presentation contract for institutional operations."
        />
        <div className="flex items-center gap-2 rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {operation.status}
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-2">
        <Field label="Operation Summary" value={operation.operationName} />
        <Field label="Relationship Identifier" value={operation.relationshipId} />
        <Field label="Operation Type" value={operation.operationType} />
        <Field label="Status" value={operation.status} />
        <Field label="Priority" value={operation.priority} />
        <Field label="Created Date" value={operation.createdDate} />
        <Field label="Updated Date" value={operation.updatedDate} />
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Summary Metadata
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Source System: {operation.summaryMetadata.sourceSystem}
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Source Reference: {operation.summaryMetadata.sourceReference}
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Tag Count: {operation.summaryMetadata.tags.length}
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Attribute Count: {operation.summaryMetadata.attributeCount}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <SectionTitle
          eyebrow="Task Section"
          title="Operational Tasks"
          description="Read-only task presentation for the current operation."
        />
          {workspace.tasks.length === 0 ? (
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-400">
            No tasks available.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {workspace.tasks.map((task) => (
              <article key={task.taskId} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{task.taskType}</p>
                    <h3 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{task.taskName}</h3>
                  </div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{task.status}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{task.description}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Field label="Task ID" value={task.taskId} />
                  <Field label="Operation ID" value={task.operationId} />
                  <Field label="Assigned To" value={task.assignedTo} />
                  <Field label="Due Date" value={task.dueDate} />
                  <Field label="Priority" value={task.priority} />
                  <Field label="Created Date" value={task.createdDate} />
                  <Field label="Updated Date" value={task.updatedDate} />
                </div>
                <section className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <h4 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Summary Metadata</h4>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <p className="text-xs text-slate-300">Source System: {task.summaryMetadata.sourceSystem}</p>
                    <p className="text-xs text-slate-300">Source Reference: {task.summaryMetadata.sourceReference}</p>
                    <p className="text-xs text-slate-300">Tag Count: {task.summaryMetadata.tags.length}</p>
                    <p className="text-xs text-slate-300">Attribute Count: {task.summaryMetadata.attributeCount}</p>
                  </div>
                </section>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-4">
        <AssignmentPanelView panel={toAssignmentPanel(workspace)} />
      </div>

      <div className="mt-4">
        <WorkQueueView queue={workspace.workQueue} />
      </div>

      <div className="mt-4">
        <TimelinePanelView panel={workspace.timelinePanel} />
      </div>

      <div className="mt-4">
        <ActivityFeedView feed={workspace.activityFeed} />
      </div>
    </section>
  );
}