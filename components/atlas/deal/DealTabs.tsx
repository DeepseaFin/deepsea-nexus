const tabs = [
  "Overview",
  "Pricing",
  "Risk",
  "Documents",
  "Term Sheet",
  "Funding",
  "Payments",
  "Notes",
  "Audit",
];

export default function DealTabs() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800">

      <div className="flex overflow-x-auto">

        {tabs.map((tab, index) => (

          <button
            key={tab}
            className={`px-6 py-5 whitespace-nowrap font-medium transition ${
              index === 0
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

      <div className="p-10 text-slate-400">
        Overview content will appear here...
      </div>

    </div>
  );
}