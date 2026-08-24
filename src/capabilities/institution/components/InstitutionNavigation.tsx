import type {
  InstitutionNavigationItem,
  InstitutionNavigationKey,
} from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionNavigationProps = {
  readonly items: readonly InstitutionNavigationItem[];
  readonly activeView: InstitutionNavigationKey;
  readonly onSelect: (view: InstitutionNavigationKey) => void;
};

export default function InstitutionNavigation({ items, activeView, onSelect }: InstitutionNavigationProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-7">
        {items.map((item) => {
          const isActive = item.key === activeView;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={[
                "rounded border px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "border-cyan-700/50 bg-cyan-950/30 text-cyan-100"
                  : "border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
