type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <span className="eyebrow">{eyebrow}</span>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
