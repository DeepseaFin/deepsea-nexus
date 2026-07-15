import type { CollectionsBoardItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type CollectionsBoardProps = {
  readonly items: readonly CollectionsBoardItem[];
};

export default function CollectionsBoard({ items }: CollectionsBoardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Collections Board</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">Receivable {item.receivableId}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.collectionStatus}</p>
            <p className="mt-1 text-xs text-slate-400">Next Action: {item.nextAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
