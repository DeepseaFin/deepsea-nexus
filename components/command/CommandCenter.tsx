"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import CommandGroup from "@/components/command/CommandGroup";
import CommandItem from "@/components/command/CommandItem";
import CommandSearch from "@/components/command/CommandSearch";
import QuickActions from "@/components/command/QuickActions";
import RecentCommands from "@/components/command/RecentCommands";
import { commandRegistry } from "@/lib/command/command.registry";
import { COMMAND_CATEGORIES, type CommandDescriptor, type CommandRegistry, type QuickActionDescriptor } from "@/lib/command/command.types";
import { isCloseCommandShortcut, isOpenCommandShortcut } from "@/lib/command/command.shortcuts";

const RECENT_COMMAND_LIMIT = 6;

export interface CommandCenterProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly registry?: CommandRegistry;
}

function matchesQuery(command: CommandDescriptor, query: string): boolean {
  if (!query) {
    return true;
  }

  const bag = [command.title, command.description, ...(command.keywords ?? [])]
    .join(" ")
    .toLowerCase();

  return bag.includes(query.toLowerCase());
}

export default function CommandCenter({ open, onOpenChange, registry = commandRegistry }: CommandCenterProps) {
  const [query, setQuery] = useState("");
  const [recentCommandIds, setRecentCommandIds] = useState<readonly string[]>([]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOpenCommandShortcut(event)) {
        event.preventDefault();
        onOpenChange(!open);
      }

      if (isCloseCommandShortcut(event) && open) {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  const filteredCommands = useMemo(() => {
    return registry.commands.filter((command) => matchesQuery(command, query));
  }, [query, registry.commands]);

  const groupedCommands = useMemo(() => {
    return COMMAND_CATEGORIES.map((category) => ({
      category,
      items: filteredCommands.filter((command) => command.category === category),
    })).filter((group) => group.items.length > 0);
  }, [filteredCommands]);

  const recentCommands = useMemo(() => {
    const lookup = new Map(registry.commands.map((command) => [command.id, command]));
    return recentCommandIds.map((id) => lookup.get(id)).filter((item): item is CommandDescriptor => Boolean(item));
  }, [recentCommandIds, registry.commands]);

  const providerResults = useMemo(() => {
    if (!query.trim()) {
      return [] as const;
    }

    return registry.searchProviders.flatMap((provider) =>
      provider.search(query).map((result) => ({
        id: `${provider.id}:${result.id}`,
        title: result.title,
        description: result.description,
        category: result.category,
      })),
    );
  }, [query, registry.searchProviders]);

  const handleCommandSelect = (command: CommandDescriptor) => {
    command.onSelect?.();
    setRecentCommandIds((current) => {
      const next = [command.id, ...current.filter((id) => id !== command.id)];
      return next.slice(0, RECENT_COMMAND_LIMIT);
    });
    onOpenChange(false);
    setQuery("");
  };

  const handleQuickActionSelect = (action: QuickActionDescriptor) => {
    action.onSelect?.();
    if (action.commandId) {
      const linked = registry.commands.find((command) => command.id === action.commandId);
      if (linked) {
        handleCommandSelect(linked);
        return;
      }
    }
    onOpenChange(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/72 p-4 pt-16 backdrop-blur-sm sm:p-6 sm:pt-20"
          role="dialog"
          aria-modal="true"
          aria-label="Global command center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.section
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-[0_24px_64px_rgba(2,6,23,0.52)]"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            onClick={(event) => event.stopPropagation()}
          >
            <CommandPrimitive className="w-full" loop>
              <CommandSearch value={query} onValueChange={setQuery} />

              <div className="max-h-[26rem] overflow-y-auto px-2 py-2 sm:px-3">
                <RecentCommands commands={recentCommands} onSelect={handleCommandSelect} />

                {groupedCommands.map((group) => (
                  <CommandGroup key={group.category} heading={group.category}>
                    {group.items.map((command) => (
                      <CommandItem
                        key={command.id}
                        title={command.title}
                        description={command.description}
                        shortcutHint={command.shortcutHint}
                        icon={command.icon}
                        disabled={command.disabled}
                        onSelect={() => handleCommandSelect(command)}
                      />
                    ))}
                  </CommandGroup>
                ))}

                {providerResults.length > 0 ? (
                  <CommandGroup heading="Provider Results">
                    {providerResults.map((result) => (
                      <CommandItem
                        key={result.id}
                        title={result.title}
                        description={result.description}
                      />
                    ))}
                  </CommandGroup>
                ) : null}

                {groupedCommands.length === 0 && providerResults.length === 0 ? (
                  <p className="px-3 py-7 text-sm text-slate-500">
                    No commands match this search. Try Customers, Deals, Documents, Approvals, Tasks,
                    Reports, or Funding.
                  </p>
                ) : null}
              </div>

              <QuickActions actions={registry.quickActions} onSelect={handleQuickActionSelect} />
            </CommandPrimitive>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
