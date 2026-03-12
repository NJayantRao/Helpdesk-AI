import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, hint, className, children }: FieldProps) {
  return (
    <label className={cn("block space-y-2.5", className)}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {hint ? (
        <span className="block text-xs leading-5 text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
