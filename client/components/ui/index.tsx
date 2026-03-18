"use client";
import React from "react";
import { cn } from "@/lib/utils";

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-indigo-300",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
}
export function Badge({ label, variant = "neutral" }: BadgeProps) {
  const variants = {
    primary: "bg-indigo-100 text-indigo-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    neutral: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant]
      )}
    >
      {label}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}
export function Card({
  children,
  className,
  hover,
  style,
  onClick,
}: CardProps) {
  return (
    <div
      style={style}
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-200 rounded-2xl",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}
export function Input({
  label,
  error,
  leftIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          className={cn(
            "w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm font-sans bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200",
            "focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100",
            leftIcon && "pl-10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <select
        className={cn(
          "w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  trend?: "up" | "down" | "neutral";
}
export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "indigo",
  trend,
}: StatCardProps) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    sky: "bg-sky-50 text-sky-600",
  };
  return (
    <Card className="p-5" hover>
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            colors[color] || colors.indigo
          )}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend === "up"
                ? "bg-emerald-100 text-emerald-600"
                : trend === "down"
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-500"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-0.5">{value}</div>
      <div className="text-sm font-medium text-slate-700">{title}</div>
      {subtitle && (
        <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
      )}
    </Card>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  avatarUrl?: string | null;
}
export function Avatar({ name, size = "md", avatarUrl }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };
  if (avatarUrl) {
    // console.log(avatarUrl);

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={cn("rounded-full object-cover shrink-0", sizes[size])}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center shrink-0",
        sizes[size]
      )}
    >
      {initials}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-400 max-w-xs">{description}</p>
      )}
    </div>
  );
}
