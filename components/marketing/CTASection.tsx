import Link from "next/link";

export interface CTASectionProps {
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

export default function CTASection({ title, description, primaryCta, secondaryCta }: CTASectionProps) {
  return (
    <section className="rounded-3xl border border-slate-700/70 bg-[linear-gradient(165deg,rgba(11,19,33,0.95),rgba(8,16,28,0.95))] p-8 sm:p-10">
      <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
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
