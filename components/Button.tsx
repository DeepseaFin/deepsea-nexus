type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const base =
    "px-8 py-4 rounded-xl font-semibold transition duration-300";

  const styles =
    variant === "primary"
      ? "bg-cyan-400 hover:bg-cyan-300 text-slate-900"
      : "border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-900";

  return (
    <button className={`${base} ${styles}`}>
      {children}
    </button>
  );
}