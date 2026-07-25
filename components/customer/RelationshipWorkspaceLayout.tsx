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
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-4">
        {header}
        {navigation}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">{content}</div>
          {rail ? <aside className="space-y-4">{rail}</aside> : null}
        </div>
      </div>
    </div>
  );
}
