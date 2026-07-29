import Link from "next/link";

export default function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-900/50 bg-[radial-gradient(circle_at_12%_8%,rgba(56,189,248,0.2),transparent_36%),radial-gradient(circle_at_82%_12%,rgba(6,182,212,0.14),transparent_34%),linear-gradient(155deg,rgba(5,18,33,0.96),rgba(3,11,21,0.96))] px-6 py-16 shadow-[0_32px_100px_rgba(10,46,72,0.42)] sm:px-10 lg:px-12 lg:py-20">
      <div className="max-w-4xl">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Deepsea Nexus</p>
        <h1 className="animate-fade-up-delay-1 mt-5 text-balance text-4xl font-semibold leading-[1.08] text-slate-100 sm:text-5xl lg:text-6xl">
          Institutional Finance, Rebuilt as an Operating System.
        </h1>
        <p className="animate-fade-up-delay-2 mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Deepsea Nexus unifies relationship origination, policy-aware workflow execution, and evidence-centered governance
          into one coordinated institutional experience built for modern trade and receivables operations.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="#industry-challenge"
            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Explore the Story
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
          >
            Schedule Executive Briefing
          </Link>
        </div>
      </div>
    </section>
  );
}
