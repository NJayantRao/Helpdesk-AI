import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function Brand({ href, compact = false, className }: BrandProps) {
  const content = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#0f172a,#1d4ed8_58%,#60a5fa)] text-white shadow-[0_18px_34px_-18px_rgba(37,99,235,0.75)]">
        <span className="grid grid-cols-2 gap-1">
          <span className="h-2.5 w-2.5 rounded-[4px] bg-white" />
          <span className="h-2.5 w-2.5 rounded-[4px] bg-white/55" />
          <span className="h-2.5 w-2.5 rounded-[4px] bg-white/55" />
          <span className="h-2.5 w-2.5 rounded-[4px] bg-white" />
        </span>
      </span>
      <span className="flex flex-col">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-slate-500">
          University ERP
        </span>
        <span
          className={cn(
            "font-semibold tracking-tight text-slate-950",
            compact ? "text-base" : "text-lg"
          )}
        >
          Campus Portal
        </span>
      </span>
    </>
  );

  const classes = cn("inline-flex items-center gap-3", className);

  if (!href) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
