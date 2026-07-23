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

export default function OperationsWorkspaceView({
  workspace,
  className,
}: OperationsWorkspaceViewProps) {
  return (
    <section
      className={withClassName(
        "rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]",
        className,
      )}
      aria-label="Operations workspace"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Operations Workspace</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Operational Execution Summary</h2>
          <p className="mt-2 text-sm text-slate-400">Foundational presentation contract for institutional operations.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {workspace.status}
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-2">
        <Field label="Operation Summary" value={workspace.operationSummary} />
        <Field label="Relationship Identifier" value={workspace.relationshipIdentifier} />
        <Field label="Operation Type" value={workspace.operationType} />
        <Field label="Status" value={workspace.status} />
        <Field label="Priority" value={workspace.priority} />
        <Field label="Created Date" value={workspace.createdDate} />
        <Field label="Updated Date" value={workspace.updatedDate} />
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Summary Metadata
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Source System: {workspace.summaryMetadata.sourceSystem}
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Source Reference: {workspace.summaryMetadata.sourceReference}
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Tag Count: {workspace.summaryMetadata.tags.length}
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            Attribute Count: {workspace.summaryMetadata.attributeCount}
          </p>
        </div>
      </section>
    </section>
  );
}