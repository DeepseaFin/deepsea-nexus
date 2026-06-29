export default function FinancialSummary() {
  return (
    <div className="mt-8 bg-slate-900 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        Financial Summary
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Metric
          title="Invoice Value"
          value="AED 2,500,000"
        />

        <Metric
          title="Advance"
          value="90%"
        />

        <Metric
          title="Funding Amount"
          value="AED 2,250,000"
        />

        <Metric
          title="Tenure"
          value="90 Days"
        />

        <Metric
          title="Discount Rate"
          value="1.65%"
        />

        <Metric
          title="Gross Return"
          value="18.20%"
        />

        <Metric
          title="Net Return"
          value="16.90%"
          highlight
        />

        <Metric
          title="Broker Commission"
          value="2.00%"
        />

      </div>

    </div>
  );
}

function Metric({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-5">

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h3
        className={`mt-2 text-2xl font-bold ${
          highlight ? "text-cyan-400" : "text-white"
        }`}
      >
        {value}
      </h3>

    </div>
  );
}