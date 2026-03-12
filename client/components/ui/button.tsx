import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "soft" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsButtonProps = SharedButtonProps &
  ComponentPropsWithoutRef<"button"> & {
    href?: never;
  };

type ButtonAsLinkProps = SharedButtonProps & {
  href: string;
  children: ReactNode;
};

function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.38)]",
    size === "lg" && "px-6 py-3.5 text-sm",
    size === "md" && "px-5 py-3 text-sm",
    size === "sm" && "px-4 py-2 text-xs",
    variant === "primary" &&
      "bg-[linear-gradient(135deg,#1d4ed8,#2563eb_52%,#60a5fa)] text-white shadow-[0_22px_40px_-24px_rgba(29,78,216,0.75)] hover:translate-y-[-1px]",
    variant === "secondary" &&
      "border border-slate-300/80 bg-white/88 text-slate-800 hover:border-slate-900 hover:bg-white",
    variant === "soft" &&
      "border border-sky-200/80 bg-sky-50 text-sky-900 hover:border-sky-300 hover:bg-sky-100/70",
    variant === "ghost" &&
      "text-slate-700 hover:bg-white/70 hover:text-slate-950",
    className
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: ButtonAsButtonProps | ButtonAsLinkProps) {
  const classes = getButtonClasses(variant, size, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    );
  }

  return <button className={classes} {...props} />;
}
