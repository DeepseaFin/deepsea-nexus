"use client";

import React from "react";
import type { CommandDescriptor } from "@/lib/command/command.types";
import CommandGroup from "@/components/command/CommandGroup";
import CommandItem from "@/components/command/CommandItem";

export interface RecentCommandsProps {
  readonly commands: readonly CommandDescriptor[];
  readonly onSelect: (command: CommandDescriptor) => void;
}

export default function RecentCommands({ commands, onSelect }: RecentCommandsProps) {
  if (commands.length === 0) {
    return null;
  }

  return (
    <CommandGroup heading="Recent Commands">
      {commands.map((command) => (
        <CommandItem
          key={command.id}
          title={command.title}
          description={command.description}
          shortcutHint={command.shortcutHint}
          icon={command.icon}
          disabled={command.disabled}
          onSelect={() => onSelect(command)}
        />
      ))}
    </CommandGroup>
  );
}
