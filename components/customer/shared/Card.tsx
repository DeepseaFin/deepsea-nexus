"use client";

import type { ReactNode } from "react";

export interface CardProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

export default function Card({
  title,
  subtitle,
  header,
  footer,
  actions,
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] shadow-[0_14px_32px_rgba(2,6,23,0.28)] backdrop-blur-sm ${className}`}
    >
      {title || subtitle || header || actions ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 px-5 py-4 sm:px-6">
          <div>
            {title ? <h3 className="text-sm font-semibold tracking-tight text-slate-100 sm:text-base">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p> : null}
            {header ? <div className="mt-2">{header}</div> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}

      <div className="px-5 py-4 sm:px-6 sm:py-5">{children}</div>

      {footer ? <footer className="border-t border-slate-800/80 px-5 py-4 sm:px-6">{footer}</footer> : null}
    </section>
  );
}
