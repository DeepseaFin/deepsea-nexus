"use client";

export default function WorkspaceTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`px-6 py-4 whitespace-nowrap font-medium transition-all ${
              activeTab === tab
                ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50"
                : "text-slate-400 border-b-2 border-transparent hover:text-cyan-300 hover:border-cyan-400/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}