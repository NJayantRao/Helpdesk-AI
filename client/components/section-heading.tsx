import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "left" && "max-w-3xl",
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      <span className="eyebrow">{eyebrow}</span>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        <p
          className={cn(
            "max-w-2xl text-base leading-8 text-slate-600 sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
