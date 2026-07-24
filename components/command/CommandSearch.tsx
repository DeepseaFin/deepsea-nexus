"use client";

import React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

export interface CommandSearchProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
}

export default function CommandSearch({ value, onValueChange }: CommandSearchProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-3 sm:px-4">
      <Search className="h-4 w-4 text-cyan-300" aria-hidden="true" />
      <CommandPrimitive.Input
        value={value}
        onValueChange={onValueChange}
        placeholder="Search customers, deals, documents, approvals, tasks, reports, funding"
        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
      />
      <span className="rounded-md border border-slate-700 px-2 py-0.5 text-[11px] text-slate-400">Esc</span>
    </div>
  );
}
