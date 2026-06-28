const industries = [
  {
    title: "Logistics & Freight",
    description:
      "Funding for freight forwarders, shipping agencies, customs brokers and transport companies.",
  },
  {
    title: "Insurance Brokers",
    description:
      "Finance earned commission receivables from corporate insurance placements.",
  },
  {
    title: "Financial Distribution",
    description:
      "Working capital solutions for financial intermediaries and FinTech distribution companies.",
  },
  {
    title: "Technology & SaaS",
    description:
      "Receivables financing for software providers and subscription businesses.",
  },
  {
    title: "Professional Services",
    description:
      "Funding consulting firms, engineering companies and project management businesses.",
  },
  {
    title: "Healthcare Suppliers",
    description:
      "Improve liquidity for medical equipment and pharmaceutical suppliers.",
  },
  {
    title: "Telecom & Enterprise IT",
    description:
      "Finance receivables for telecom distributors and enterprise technology providers.",
  },
  {
    title: "Contracting & Industrial",
    description:
      "Structured funding for infrastructure and industrial service companies.",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="bg-[#07111F] py-28">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
            INDUSTRIES WE SERVE
          </p>

          <h2 className="text-5xl font-bold text-white mt-4">
            Built For Growing Businesses
          </h2>

          <p className="text-slate-400 text-xl mt-6 max-w-3xl mx-auto">
            We provide structured receivables financing across industries with
            recurring invoices and institutional-quality counterparties.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {industries.map((industry) => (

            <div
              key={industry.title}
              className="border border-slate-700 rounded-2xl p-8 hover:border-cyan-400 transition duration-300"
            >

              <h3 className="text-2xl font-semibold text-white mb-4">
                {industry.title}
              </h3>

              <p className="text-slate-400">
                {industry.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}