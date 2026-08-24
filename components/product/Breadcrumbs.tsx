import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface ProductBreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

export interface BreadcrumbsProps {
  readonly items: readonly ProductBreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="truncate text-slate-400 ds-motion hover:text-slate-200">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "truncate text-slate-200" : "truncate text-slate-400"}>{item.label}</span>
              )}
              {!isLast ? <ChevronRight className="h-3 w-3 text-slate-600" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
