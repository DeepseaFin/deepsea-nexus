"use client";

import { useState } from "react";

const currencies = [
  "AED",
  "USD",
  "EUR",
  "GBP",
  "INR",
  "SAR",
  "QAR",
  "KWD",
  "BHD",
  "SGD",
];

export default function FundingCalculator() {
  const [currency, setCurrency] = useState("AED");
  const [invoiceAmount, setInvoiceAmount] = useState(1000000);
  const [advanceRate, setAdvanceRate] = useState(90);
  const [tenure, setTenure] = useState(90);
  const [discountRate, setDiscountRate] = useState(1.65);

  const fundingAmount = invoiceAmount * advanceRate / 100;

  const discountFee =
    fundingAmount *
    (discountRate / 100) *
    (tenure / 365);

  const netDisbursement =
    fundingAmount - discountFee;

  return (
    <section
      id="calculator"
      className="bg-slate-950 py-28"
    >
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <p className="uppercase tracking-[0.3em] text-cyan-400 text-sm">
            FUNDING CALCULATOR
          </p>

          <h2 className="text-5xl font-bold text-white mt-4">
            Estimate Your Funding
          </h2>

          <p className="text-slate-400 mt-6 text-xl">
            Calculate indicative funding available for your receivables.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT */}

          <div className="bg-slate-900 rounded-3xl p-10">

            <div className="mb-6">

              <label className="text-slate-300">
                Currency
              </label>

              <select
                className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white"
                value={currency}
                onChange={(e)=>setCurrency(e.target.value)}
              >
                {currencies.map((c)=>(

                  <option key={c}>
                    {c}
                  </option>

                ))}
              </select>

            </div>

            <div className="mb-6">

              <label className="text-slate-300">
                Invoice Amount
              </label>

              <input
                type="number"
                className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white"
                value={invoiceAmount}
                onChange={(e)=>setInvoiceAmount(Number(e.target.value))}
              />

            </div>

            <div className="mb-6">

              <label className="text-slate-300">
                Advance Rate (%)
              </label>

              <input
                type="number"
                className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white"
                value={advanceRate}
                onChange={(e)=>setAdvanceRate(Number(e.target.value))}
              />

            </div>

            <div className="mb-6">

              <label className="text-slate-300">
                Tenure (Days)
              </label>

              <input
                type="number"
                className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white"
                value={tenure}
                onChange={(e)=>setTenure(Number(e.target.value))}
              />

            </div>

            <div>

              <label className="text-slate-300">
                Discount Rate (% p.a.)
              </label>

              <input
                type="number"
                step="0.01"
                className="w-full mt-2 p-4 rounded-xl bg-slate-800 text-white"
                value={discountRate}
                onChange={(e)=>setDiscountRate(Number(e.target.value))}
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="bg-cyan-500 rounded-3xl p-10 text-black">

            <h3 className="text-3xl font-bold mb-10">
              Indicative Funding
            </h3>

            <div className="space-y-8 text-xl">

              <div className="flex justify-between">
                <span>Funding Amount</span>
                <strong>
                  {currency} {fundingAmount.toLocaleString()}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Discount Fee</span>
                <strong>
                  {currency} {discountFee.toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between text-3xl font-bold border-t pt-8">

                <span>Net Disbursement</span>

                <span>
                  {currency} {netDisbursement.toFixed(2)}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}