import type { ButtonHTMLAttributes, ReactNode } from "react";

export type UIButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type UIButtonSize = "sm" | "md" | "lg";

export interface UIButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  readonly children: ReactNode;
  readonly variant?: UIButtonVariant;
  readonly size?: UIButtonSize;
  readonly fullWidth?: boolean;
}

const sizeClasses: Readonly<Record<UIButtonSize, string>> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
};

const variantClasses: Readonly<Record<UIButtonVariant, string>> = {
  primary: "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
  secondary: "border border-cyan-400 text-cyan-200 hover:bg-cyan-900/30",
  ghost: "border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-slate-100",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
};

export default function UIButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: UIButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl font-semibold ds-motion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
