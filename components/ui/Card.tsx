import type { HTMLAttributes, ReactNode } from "react";

export type UICardVariant = "default" | "elevated" | "subtle" | "accent" | "ai";

export interface UICardProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly variant?: UICardVariant;
  readonly interactive?: boolean;
}

const variantClasses: Readonly<Record<UICardVariant, string>> = {
  default: "ds-surface-1",
  elevated: "ds-surface-1 ds-elevation-md",
  subtle: "bg-slate-950/55 border border-slate-800",
  accent: "border border-cyan-700/60 bg-cyan-950/20",
  ai: "ds-ai-signal ds-ai-glow",
};

export default function UICard({
  children,
  variant = "default",
  interactive = false,
  className = "",
  ...props
}: UICardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ds-motion ${variantClasses[variant]} ${interactive ? "hover:-translate-y-0.5 hover:border-cyan-500/60" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
