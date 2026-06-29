const cards = [
  {
    title: "Invoice Value",
    value: "AED 2,500,000",
  },
  {
    title: "Funding Required",
    value: "AED 2,250,000",
  },
  {
    title: "Expected Return",
    value: "18.20%",
  },
  {
    title: "Risk Rating",
    value: "AA",
  },
];

export default function DealKPIs() {
  return (
    <div className="grid grid-cols-4 gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
        >

          <p className="text-slate-400 text-sm">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-3">
            {card.value}
          </h2>

        </div>

      ))}

    </div>
  );
}