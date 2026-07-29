import Link from "next/link";

export default function FinalCtaSection() {
  return (
    <section id="final-cta" className="scroll-mt-24 rounded-3xl border border-cyan-800/60 bg-[linear-gradient(150deg,rgba(7,27,43,0.95),rgba(5,19,33,0.95))] p-8 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">9. Final CTA</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
        Ready to Transition from Fragmented Tools to Institutional Flow?
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
        Engage with the Deepsea Nexus team to align ATLAS execution workspaces, DNOS architecture, and Business Passport intelligence
        with your institution&apos;s operating mandate.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
        >
          Start Institutional Briefing
        </Link>
        <Link
          href="/platform"
          className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
        >
          Review Platform Foundation
        </Link>
      </div>
    </section>
  );
}
