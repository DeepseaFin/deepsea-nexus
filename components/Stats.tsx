export default function Stats() {
  return (
    <section className="bg-[#0A1525] py-20">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div>
            <h2 className="text-5xl font-bold text-cyan-300">$500M+</h2>
            <p className="text-slate-400 mt-3">
              Receivables Financed
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-cyan-300">250+</h2>
            <p className="text-slate-400 mt-3">
              Corporate Clients
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-cyan-300">15+</h2>
            <p className="text-slate-400 mt-3">
              Industries Served
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-cyan-300">100%</h2>
            <p className="text-slate-400 mt-3">
              Institutional Governance
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}