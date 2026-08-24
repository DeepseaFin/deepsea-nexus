import type { InstitutionKnowledgeGraphState } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionKnowledgeGraphProps = {
  readonly graph: InstitutionKnowledgeGraphState;
};

export default function InstitutionKnowledgeGraph({ graph }: InstitutionKnowledgeGraphProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Institution Knowledge Graph</h2>
      <div className="mt-3 grid gap-2 xl:grid-cols-2">
        <article className="rounded border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nodes</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            {graph.nodes.map((node) => (
              <li key={node.id}>
                <span className="font-medium text-slate-100">{node.label}</span>
                <span className="text-slate-500"> ({node.type})</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Relationships</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            {graph.edges.map((edge, index) => (
              <li key={`${edge.sourceId}-${edge.targetId}-${index}`}>
                <span className="text-slate-100">{edge.sourceId}</span>
                <span className="mx-1 text-cyan-300">{edge.relation}</span>
                <span className="text-slate-100">{edge.targetId}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
