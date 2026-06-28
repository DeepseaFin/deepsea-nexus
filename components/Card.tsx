import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-8 hover:border-cyan-400 transition duration-300">
      {children}
    </div>
  );
}