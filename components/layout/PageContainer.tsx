import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

export interface PageContainerProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly actions?: React.ReactNode;
  readonly children: React.ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <header className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 shadow-[0_10px_24px_rgba(2,6,23,0.2)] sm:p-5">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="transition hover:text-slate-300">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-slate-300" : undefined}>{crumb.label}</span>
                    )}
                    {!isLast ? <span aria-hidden="true">/</span> : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
          </div>
          {actions ? <div className="w-full md:w-auto">{actions}</div> : null}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
