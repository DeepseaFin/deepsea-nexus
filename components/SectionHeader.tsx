type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="text-center mb-20">

      <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
        {eyebrow}
      </p>

      <h2 className="text-5xl font-bold text-white mt-4">
        {title}
      </h2>

      <p className="text-slate-400 text-xl mt-6 max-w-3xl mx-auto">
        {description}
      </p>

    </div>
  );
}