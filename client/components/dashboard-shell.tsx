"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Bell,
  Bot,
  ChartNoAxesColumn,
  FileStack,
  Home,
  Settings2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
  Users,
} from "lucide-react";

import { Brand } from "@/components/brand";
import type { NavIcon, NavItem } from "@/lib/contracts";
import { cn } from "@/lib/utils";

const iconMap: Record<NavIcon, LucideIcon> = {
  home: Home,
  chart: ChartNoAxesColumn,
  bot: Bot,
  bell: Bell,
  file: FileStack,
  user: UserRound,
  shield: ShieldCheck,
  users: Users,
  upload: UploadCloud,
  settings: Settings2,
};

type DashboardShellProps = {
  role: string;
  title: string;
  subtitle: string;
  items: NavItem[];
  children: ReactNode;
};

function isActive(pathname: string, item: NavItem) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function DashboardShell({
  role,
  title,
  subtitle,
  items,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const activeItem = items.find((item) => isActive(pathname, item));
  const roleSummary =
    role === "Student"
      ? "Use this space to stay on top of records, notices, and account details."
      : "Use this space to manage documents, people, results, and daily work.";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_25%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_20%),linear-gradient(180deg,#f8f5ef_0%,#eef4ff_48%,#f7fafc_100%)]">
      <div className="section-shell flex min-h-screen gap-6 py-4">
        <aside className="hidden w-[320px] shrink-0 xl:block">
          <div className="surface-card sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-y-auto p-5">
            <Brand href="/" />
            <div className="mt-8 rounded-[28px] bg-[linear-gradient(145deg,#0f172a,#1e3a8a_62%,#2563eb)] px-5 py-5 text-white shadow-[0_28px_60px_-28px_rgba(29,78,216,0.72)]">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/55">
                Workspace role
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {role}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/78">
                {roleSummary}
              </p>
            </div>

            <nav className="mt-6 flex flex-1 flex-col gap-2">
              {items.map((item) => {
                const Icon = iconMap[item.icon];
                const active = isActive(pathname, item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-[24px] border px-4 py-4 transition",
                      active
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_22px_44px_-22px_rgba(15,23,42,0.82)]"
                        : "border-white/70 bg-white/70 text-slate-700 hover:border-slate-900 hover:bg-white/92"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "mt-0.5 rounded-2xl p-2.5",
                          active
                            ? "bg-white/10 text-white"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{item.label}</p>
                          {item.badge ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
                                active
                                  ? "bg-white/12 text-white/80"
                                  : "bg-sky-100 text-sky-700"
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={cn(
                            "text-sm leading-6",
                            active ? "text-white/72" : "text-slate-500"
                          )}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-[26px] border border-dashed border-slate-300/70 bg-white/56 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4" />
                Quick tip
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the sidebar to switch sections, and the support bubble in
                the corner whenever you need quick help.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="surface-card px-5 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <span className="eyebrow">{role} workspace</span>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {title}
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    {subtitle}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  <Bell className="h-4 w-4" />
                  Live status
                </span>
                <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">
                  {activeItem?.label ?? role}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-1 xl:hidden">
              {items.map((item) => {
                const active = isActive(pathname, item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
                      active
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200/80 bg-white text-slate-700"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <main className="mt-6 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
