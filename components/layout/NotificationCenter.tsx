"use client";

import React from "react";
import { Bell } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export interface NotificationCenterProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

const pendingNotifications = [
  {
    id: "approval-awaiting-review",
    title: "Approval requires review",
    description: "A pending approval is awaiting institutional review in Approval Center.",
    timeLabel: "Now",
  },
  {
    id: "document-request-complete",
    title: "Document package completed",
    description: "A required institutional document package has been marked complete.",
    timeLabel: "5m",
  },
];

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  if (!open) {
    return null;
  }

  return (
    <section
      className="absolute right-0 top-12 z-50 w-[22rem] rounded-2xl border border-slate-800 bg-slate-950/95 p-3 shadow-[0_20px_45px_rgba(2,6,23,0.45)] backdrop-blur"
      role="dialog"
      aria-label="Notification center"
    >
      <header className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          Close
        </button>
      </header>

      {pendingNotifications.length === 0 ? (
        <EmptyState
          title="No active notifications"
          description="Operational and approval notifications will appear here when events require attention."
        />
      ) : (
        <ul className="space-y-2">
          {pendingNotifications.map((notification) => (
            <li
              key={notification.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bell className="mt-0.5 h-3.5 w-3.5 text-cyan-300" />
                  <p className="text-sm font-medium text-slate-100">{notification.title}</p>
                </div>
                <span className="text-[11px] text-slate-500">{notification.timeLabel}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{notification.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
