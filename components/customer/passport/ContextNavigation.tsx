import Link from "next/link";
import UICard from "@/components/ui/Card";

export interface ContextNavigationItem {
  readonly id: string;
  readonly label: string;
}

export interface ContextNavigationProps {
  readonly items: readonly ContextNavigationItem[];
}

export default function ContextNavigation({ items }: ContextNavigationProps) {
  return (
    <UICard variant="subtle" className="p-4 sm:p-5" aria-label="Business passport context navigation">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Context Navigation</h3>
      <nav aria-label="Section navigation" className="mt-3">
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-300 ds-motion hover:border-slate-500 hover:text-slate-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </UICard>
  );
}
