import type { ReactNode } from "react";

export interface SectionFrameProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export default function SectionFrame({ id, eyebrow, title, description, children }: SectionFrameProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6 rounded-3xl border border-slate-800/80 bg-[#081524]/75 p-6 sm:p-8 lg:p-10">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
      </header>
      {children}
    </section>
  );
}
