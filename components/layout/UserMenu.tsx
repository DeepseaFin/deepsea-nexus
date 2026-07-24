"use client";

import React from "react";
import { LogOut, Settings, UserCircle2 } from "lucide-react";
import type { UserRole } from "@/lib/design/roles";
import { USER_ROLE_LABELS } from "@/lib/design/roles";

export interface UserMenuProps {
  readonly open: boolean;
  readonly currentRole: UserRole;
  readonly onRoleChange: (role: UserRole) => void;
  readonly onClose: () => void;
}

export default function UserMenu({ open, currentRole, onRoleChange, onClose }: UserMenuProps) {
  if (!open) {
    return null;
  }

  const roleOptions = Object.entries(USER_ROLE_LABELS) as ReadonlyArray<[UserRole, string]>;

  return (
    <section
      className="absolute right-0 top-12 z-50 w-[18rem] rounded-2xl border border-slate-800 bg-slate-950/95 p-3 shadow-[0_20px_45px_rgba(2,6,23,0.45)] backdrop-blur"
      role="dialog"
      aria-label="User menu"
    >
      <header className="mb-3 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <UserCircle2 className="h-6 w-6 text-cyan-300" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-slate-100">Institutional User</p>
          <p className="text-xs text-slate-400">{USER_ROLE_LABELS[currentRole]}</p>
        </div>
      </header>

      <div>
        <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">Role</p>
        <ul className="space-y-1">
          {roleOptions.map(([role, label]) => (
            <li key={role}>
              <button
                type="button"
                onClick={() => {
                  onRoleChange(role);
                  onClose();
                }}
                className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition ${
                  currentRole === role
                    ? "border border-cyan-700/40 bg-cyan-900/30 text-cyan-100"
                    : "border border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 grid gap-2 border-t border-slate-800 pt-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-rose-700/40 bg-rose-900/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-200"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </section>
  );
}
