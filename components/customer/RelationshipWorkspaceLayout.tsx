"use client";

import type { ReactNode } from "react";

export interface RelationshipWorkspaceLayoutProps {
  readonly header: ReactNode;
  readonly navigation: ReactNode;
  readonly content: ReactNode;
  readonly rail?: ReactNode;
}

export default function RelationshipWorkspaceLayout({
  header,
  navigation,
  content,
  rail,
}: RelationshipWorkspaceLayoutProps) {
  return (
    <div className="space-y-5 p-4 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {header}
        {navigation}

        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">{content}</div>
          {rail ? <aside className="space-y-4">{rail}</aside> : null}
        </div>
      </div>
    </div>
  );
}
