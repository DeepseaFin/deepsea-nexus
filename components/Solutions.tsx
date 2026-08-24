import Card from "@/components/Card";
import SectionHeader from "@/components/SectionHeader";

const solutions = [
  {
    title: "Invoice Discounting",
    description:
      "Unlock working capital by financing approved invoices before maturity.",
  },
  {
    title: "Receivables Purchase",
    description:
      "Institutional purchase of receivables through transparent financing structures.",
  },
  {
    title: "Forfaiting",
    description:
      "Cross-border trade finance solutions with disciplined risk management.",
  },
  {
    title: "Supply Chain Finance",
    description:
      "Improve supplier liquidity while optimizing your working capital cycle.",
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="bg-[#07111F] py-24">
      <div className="max-w-7xl mx-auto px-8">

        <SectionHeader
          eyebrow="OUR SOLUTIONS"
          title="Structured Finance Solutions"
          description="Deepsea Nexus provides institutional receivables financing solutions designed to unlock liquidity and accelerate growth."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">

         {solutions.map((solution) => (

  <Card key={solution.title}>

    <h3 className="text-2xl font-semibold text-white">
      {solution.title}
    </h3>

    <p className="text-slate-400 mt-4">
      {solution.description}
    </p>

  </Card>

))}
        </div>

      </div>
    </section>
  );
}