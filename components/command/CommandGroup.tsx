"use client";

import React from "react";
import { Command as CommandPrimitive } from "cmdk";

export interface CommandGroupProps {
  readonly heading: string;
  readonly children: React.ReactNode;
}

export default function CommandGroup({ heading, children }: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-slate-500"
    >
      {children}
    </CommandPrimitive.Group>
  );
}
