const steps = [
  {
    number: "01",
    title: "Apply",
    description:
      "Submit your funding request together with basic company information.",
  },
  {
    number: "02",
    title: "Document Review",
    description:
      "Upload invoices, contracts and supporting documents for assessment.",
  },
  {
    number: "03",
    title: "Credit Assessment",
    description:
      "Our underwriting team evaluates the receivables and debtor quality.",
  },
  {
    number: "04",
    title: "Funding Offer",
    description:
      "Receive a transparent funding proposal with clear commercial terms.",
  },
  {
    number: "05",
    title: "Funds Released",
    description:
      "Upon acceptance, funds are released quickly through our structured process.",
  },
];

export default function FundingProcess() {
  return (
    <section id="process" className="bg-[#06101D] py-28">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-20">

          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
            HOW IT WORKS
          </p>

          <h2 className="text-5xl font-bold text-white mt-4">
            Funding Process
          </h2>

          <p className="text-slate-400 text-xl mt-6 max-w-3xl mx-auto">
            A disciplined, transparent and efficient funding process designed
            for institutional clients.
          </p>

        </div>

        <div className="grid md:grid-cols-5 gap-8">

          {steps.map((step) => (

            <div
              key={step.number}
              className="relative text-center"
            >

              <div className="w-20 h-20 rounded-full bg-cyan-400 text-slate-900 font-bold text-2xl flex items-center justify-center mx-auto mb-6">
                {step.number}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {step.title}
              </h3>

              <p className="text-slate-400">
                {step.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}