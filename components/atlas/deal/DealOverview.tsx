export default function DealOverview() {
  return (
    <div className="mt-8 grid grid-cols-2 xl:grid-cols-3 gap-6">

      {/* Seller */}

      <div className="bg-slate-900 rounded-2xl p-6">
        <p className="text-slate-400 text-sm mb-4">Seller</p>

        <h3 className="text-xl font-bold text-white">
          FinQy Financial Brokers LLC
        </h3>

        <div className="mt-5 space-y-2 text-slate-300">

          <div className="flex justify-between">
            <span>Relationship</span>
            <span>Preferred</span>
          </div>

          <div className="flex justify-between">
            <span>Previous Deals</span>
            <span>48</span>
          </div>

          <div className="flex justify-between">
            <span>Outstanding</span>
            <span>AED 4.2M</span>
          </div>

          <div className="flex justify-between">
            <span>Defaults</span>
            <span>0</span>
          </div>

        </div>

      </div>

      {/* Counterparty */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <p className="text-slate-400 text-sm mb-4">
          Counterparty
        </p>

        <h3 className="text-xl font-bold text-white">
          Mashreq Bank
        </h3>

        <div className="mt-5 space-y-2 text-slate-300">

          <div className="flex justify-between">
            <span>Country</span>
            <span>UAE</span>
          </div>

          <div className="flex justify-between">
            <span>Industry</span>
            <span>Banking</span>
          </div>

          <div className="flex justify-between">
            <span>Internal Rating</span>
            <span className="text-cyan-400 font-semibold">
              AAA
            </span>
          </div>

          <div className="flex justify-between">
            <span>Avg Payment</span>
            <span>26 Days</span>
          </div>

        </div>

      </div>

      {/* Constitution */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <p className="text-slate-400 text-sm mb-4">
          Constitution Check
        </p>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Deal Size</span>
            <span className="text-green-400">PASS</span>
          </div>

          <div className="flex justify-between">
            <span>Minimum Return</span>
            <span className="text-green-400">PASS</span>
          </div>

          <div className="flex justify-between">
            <span>Rating</span>
            <span className="text-green-400">PASS</span>
          </div>

          <div className="flex justify-between">
            <span>Documentation</span>
            <span className="text-green-400">PASS</span>
          </div>

        </div>

      </div>

    </div>
  );
}