import Link from "next/link";

export interface PageHeroProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta: {
    readonly href: string;
    readonly label: string;
  };
  readonly secondaryCta?: {
    readonly href: string;
    readonly label: string;
  };
}

export default function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-900/40 bg-[linear-gradient(145deg,rgba(3,21,34,0.92),rgba(9,28,42,0.88))] px-6 py-14 shadow-[0_30px_80px_rgba(8,47,73,0.35)] sm:px-10 sm:py-16">
      <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={primaryCta.href}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
        >
          {primaryCta.label}
        </Link>

        {secondaryCta ? (
          <Link
            href={secondaryCta.href}
            className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
          >
            {secondaryCta.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
