const features = [
  {
    title: "Institutional Governance",
    description:
      "Every transaction is backed by disciplined documentation, transparent structures and strong governance standards.",
  },
  {
    title: "Speed with Discipline",
    description:
      "Fast funding decisions supported by structured underwriting and institutional credit processes.",
  },
  {
    title: "Risk-First Approach",
    description:
      "Every receivable is assessed using counterparty quality, payment history and transaction structure.",
  },
  {
    title: "Cross-Border Expertise",
    description:
      "Deep experience in structuring receivables financing for regional and international trade.",
  },
];

export default function WhyNexus() {
  return (
    <section id="why" className="bg-slate-950 py-28">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-20">

          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
  WHY DEEPSEA NEXUS
</p>

<h2 className="text-5xl font-bold text-white mt-4">
  Built on Trust. Driven by Discipline.
</h2>
          <p className="text-slate-400 text-xl mt-6 max-w-3xl mx-auto">
            We combine institutional governance, disciplined underwriting and
            technology-driven execution to deliver reliable receivables
            financing solutions.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="rounded-2xl border border-slate-700 bg-slate-900/50 p-10 hover:border-cyan-400 transition duration-300"
            >

              <div className="w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400 flex items-center justify-center mb-6">

                <span className="text-cyan-400 text-2xl">
                  ✓
                </span>

              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-8">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}