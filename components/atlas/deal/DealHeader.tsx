export default function DealHeader() {
  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-cyan-400 text-sm tracking-widest uppercase">
            Deal ID
          </p>

          <h1 className="text-4xl font-bold text-white mt-2">
            DNX-2026-000001
          </h1>

          <p className="text-slate-400 mt-4">
            Emirates Steel Receivables Purchase
          </p>

        </div>

        <div className="text-right">

          <div className="inline-block bg-amber-500 text-black px-5 py-2 rounded-full font-semibold">
            Under Credit Review
          </div>

          <p className="text-slate-400 mt-4">
            Created: 29 Jun 2026
          </p>

        </div>

      </div>

    </div>
  );
}