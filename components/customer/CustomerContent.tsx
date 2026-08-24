"use client";

import React from "react";

export interface CustomerContentProps {
  readonly main: React.ReactNode;
  readonly sidebar: React.ReactNode;
}

export default function CustomerContent({ main, sidebar }: CustomerContentProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-5">
      <div>{main}</div>
      <div>{sidebar}</div>
    </section>
  );
}
