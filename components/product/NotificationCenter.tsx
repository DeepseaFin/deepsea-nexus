import { BellRing } from "lucide-react";
import UICard from "@/components/ui/Card";

export interface ProductNotificationItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly timestampLabel?: string;
  readonly unread?: boolean;
}

export interface NotificationCenterProps {
  readonly open: boolean;
  readonly items: readonly ProductNotificationItem[];
  readonly onClose: () => void;
}

export default function NotificationCenter({ open, items, onClose }: NotificationCenterProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute right-0 top-12 z-40 w-[340px] max-w-[calc(100vw-2rem)]">
      <UICard variant="elevated" className="p-4">
        <header className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-100">Notifications</p>
          <button type="button" onClick={onClose} className="text-xs text-slate-400 ds-motion hover:text-slate-200">
            Close
          </button>
        </header>

        {items.length === 0 ? (
          <p className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-400">
            No new notifications.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-start gap-2">
                  <BellRing className={`mt-0.5 h-4 w-4 ${item.unread ? "text-cyan-300" : "text-slate-500"}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100">{item.title}</p>
                    {item.description ? <p className="mt-1 text-xs text-slate-400">{item.description}</p> : null}
                    {item.timestampLabel ? <p className="mt-1 text-[11px] text-slate-500">{item.timestampLabel}</p> : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </UICard>
    </div>
  );
}
