"use client";

import { Search } from "lucide-react";
import UIButton from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";

export interface GlobalSearchProps {
  readonly placeholder?: string;
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly onSearch?: (value: string) => void;
}

export default function GlobalSearch({
  placeholder = "Search workspaces, records, decisions",
  value,
  onValueChange,
  onSearch,
}: GlobalSearchProps) {
  return (
    <form
      className="flex w-full min-w-[220px] max-w-[560px] items-center gap-2"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const query = String(form.get("q") ?? "");
        onSearch?.(query);
      }}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" aria-hidden="true" />
        <TextInput
          name="q"
          value={value}
          onChange={(event) => onValueChange?.(event.currentTarget.value)}
          placeholder={placeholder}
          className="pl-9"
          aria-label="Global search"
        />
      </div>
      <UIButton size="sm" variant="ghost" type="submit" aria-label="Search">
        Go
      </UIButton>
    </form>
  );
}
