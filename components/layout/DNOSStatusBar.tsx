export interface DNOSStatusBarProps {
  readonly environment?: string;
  readonly workspace?: string;
  readonly version?: string;
  readonly connectionStatus?: string;
}

export default function DNOSStatusBar({
  environment = 'Development',
  workspace = 'Atlas',
  version = 'Release 1',
  connectionStatus = 'Online',
}: DNOSStatusBarProps) {
  const items = [
    { label: 'Environment', value: environment },
    { label: 'Workspace', value: workspace },
    { label: 'Version', value: version },
    { label: 'Status', value: connectionStatus },
  ] as const;

  return (
    <footer className="border-t border-slate-800/90 bg-[#050d18]">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-xs sm:px-6 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-slate-400">
            <span className="uppercase tracking-[0.16em] text-slate-500">{item.label}</span>
            <span className="font-semibold text-slate-200">{item.value}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}
