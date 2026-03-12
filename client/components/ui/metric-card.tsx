import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "dark" | "sky" | "warm";
};

export function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: MetricCardProps) {
  return (
    <article
      className={cn(
        "rounded-[28px] border p-5 shadow-[0_28px_64px_-40px_rgba(15,23,42,0.38)]",
        tone === "default" && "border-white/70 bg-white/82 backdrop-blur-xl",
        tone === "dark" && "border-slate-900 bg-slate-950 text-white",
        tone === "sky" && "border-sky-200/90 bg-sky-50/92",
        tone === "warm" && "border-amber-200/90 bg-amber-50/92"
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.22em]",
          tone === "dark" ? "text-white/55" : "text-slate-500"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-4 text-4xl font-semibold tracking-tight",
          tone === "dark" ? "text-white" : "text-slate-950"
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-4 text-sm leading-6",
          tone === "dark" ? "text-white/72" : "text-slate-600"
        )}
      >
        {detail}
      </p>
    </article>
  );
}
