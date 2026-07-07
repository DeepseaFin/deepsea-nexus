'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useSearchRegistry } from './SearchRegistry';

export default function SmartSearchBar({
  onOpenPalette,
}: {
  onOpenPalette: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const { search } = useSearchRegistry();

  const suggestions = useMemo(() => {
    if (value.trim().length < 2) {
      return [];
    }
    return search(value).slice(0, 5);
  }, [search, value]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">
        <Search className="h-4 w-4 text-cyan-300" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask ATLAS"
          className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          onKeyDown={(event) => {
            if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              onOpenPalette();
            }
          }}
        />
        <button
          type="button"
          onClick={onOpenPalette}
          className="rounded-md border border-slate-600 px-2 py-0.5 text-[11px] text-slate-400 transition hover:text-slate-200"
        >
          ⌘K
        </button>
      </div>

      {suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 backdrop-blur">
          {suggestions.map((item) => (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              onClick={() => router.push(item.href)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <span>{item.title}</span>
              <span className="text-xs uppercase tracking-wide text-slate-500">{item.type}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
