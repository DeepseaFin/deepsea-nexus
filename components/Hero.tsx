import Button from "@/components/Button";
export default function Hero() {
  return (
    <section 
    id="home"
    className="min-h-screen bg-[#07111F] text-white flex items-center">
      <div className="max-w-7xl mx-auto px-8">

        <div className="max-w-4xl">

          <p className="uppercase tracking-[0.3em] text-cyan-300 text-sm font-semibold mb-6">
            UAE Structured Receivables & Trade Finance
          </p>

          <h1 className="text-7xl font-bold leading-tight mb-8">
            Unlock Liquidity.
            <br />
            Accelerate Growth.
          </h1>

          <p className="text-2xl text-slate-300 leading-relaxed mb-10">
            Deepsea Nexus provides structured receivables and trade finance
            solutions that help businesses unlock working capital while
            maintaining disciplined risk management and institutional
            governance.
          </p>

          <div className="flex gap-6">

  <Button>
    Apply for Funding
  </Button>

  <Button variant="secondary">
    Download Brochure
  </Button>

</div>

        </div>

      </div>
    </section>
  );
}