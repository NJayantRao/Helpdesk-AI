import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bell,
  FileStack,
  GraduationCap,
  LogOut,
  Settings2,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";

import { logoutAction } from "@/app/auth-actions";
import { Brand } from "@/components/brand";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { adminMetrics, adminQueue, departmentHealth } from "@/lib/admin-data";
import type { DemoSession } from "@/lib/auth";
import { isAdminRole } from "@/lib/auth";
import {
  noticeBoard,
  studentOverviewMetrics,
  studentTasks,
} from "@/lib/student-data";

type QuickLink = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  tone: "secondary" | "soft";
};

type FeedCard = {
  id: string;
  title: string;
  eyebrow: string;
  detail: string;
};

const authNavItems = [
  { href: "#workspace", label: "Workspace" },
  { href: "#activity", label: "Activity" },
];

function getLandingCopy(session: DemoSession) {
  if (isAdminRole(session.role)) {
    return {
      eyebrow: "Signed-in admin home",
      title: `Welcome back, ${session.name}.`,
      description:
        "Use this page as a quick handoff into documents, users, results, and daily operations.",
      primaryCta: "Open Admin Console",
      secondaryCta: "Open User Access",
      secondaryHref: "/admin/users",
      metrics: adminMetrics.slice(0, 3),
      quickLinks: [
        {
          title: "Document operations",
          description:
            "Review uploads, verification status, and source refresh work.",
          href: "/admin/documents",
          cta: "Open document ops",
          icon: FileStack,
          tone: "secondary",
        },
        {
          title: "User access",
          description:
            "Manage approvals, roles, and account status from one place.",
          href: "/admin/users",
          cta: "Manage users",
          icon: Users,
          tone: "soft",
        },
        {
          title: "Settings",
          description:
            "Check workspace settings, operational limits, and defaults.",
          href: "/admin/settings",
          cta: "Open settings",
          icon: Settings2,
          tone: "secondary",
        },
      ] satisfies QuickLink[],
      priorityTitle: "Priority queue",
      priorityDescription:
        "The first operational items worth reviewing in this session.",
      priorities: adminQueue.slice(0, 3).map(
        (item): FeedCard => ({
          id: item.id,
          title: item.title,
          eyebrow: `${item.owner} / ${item.status}`,
          detail: item.eta,
        })
      ),
      signalTitle: "Department signals",
      signalDescription:
        "Coverage and readiness updates that may need follow-up today.",
      signals: departmentHealth.slice(0, 3).map(
        (item): FeedCard => ({
          id: item.id,
          title: item.name,
          eyebrow: `${item.coverage} coverage / ${item.readiness}`,
          detail: item.note,
        })
      ),
    };
  }

  return {
    eyebrow: "Signed-in student home",
    title: `Welcome back, ${session.name}.`,
    description:
      "Use this page to jump quickly into results, notices, profile settings, and the rest of your workspace.",
    primaryCta: "Open Student Workspace",
    secondaryCta: "Open Notices",
    secondaryHref: "/dashboard/notices",
    metrics: studentOverviewMetrics.slice(0, 3),
    quickLinks: [
      {
        title: "Results and records",
        description:
          "Review published semester results, course grades, and academic progress.",
        href: "/dashboard/results",
        cta: "Open results",
        icon: GraduationCap,
        tone: "secondary",
      },
      {
        title: "Notice center",
        description:
          "Catch department updates, exam reminders, and university announcements.",
        href: "/dashboard/notices",
        cta: "Read notices",
        icon: Bell,
        tone: "soft",
      },
      {
        title: "Profile and settings",
        description:
          "Manage profile details, language preferences, and account settings.",
        href: "/dashboard/profile",
        cta: "Open profile",
        icon: UserRound,
        tone: "secondary",
      },
    ] satisfies QuickLink[],
    priorityTitle: "Today's priorities",
    priorityDescription:
      "Tasks that deserve attention before you continue deeper into the workspace.",
    priorities: studentTasks.map(
      (item): FeedCard => ({
        id: item.id,
        title: item.title,
        eyebrow: `${item.owner} / ${item.status}`,
        detail: item.due,
      })
    ),
    signalTitle: "Notice radar",
    signalDescription:
      "Recent updates you may want visible right from your signed-in home.",
    signals: noticeBoard.slice(0, 3).map(
      (item): FeedCard => ({
        id: item.id,
        title: item.title,
        eyebrow: `${item.department} / ${item.priority} priority`,
        detail: item.summary,
      })
    ),
  };
}

export function AuthenticatedLanding({ session }: { session: DemoSession }) {
  const landing = getLandingCopy(session);

  return (
    <main className="pb-20">
      <header className="sticky top-0 z-50 border-b border-white/70 bg-[rgba(248,245,239,0.82)] backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-6">
          <Brand href="/" compact />
          <nav className="hidden items-center gap-7 lg:flex">
            {authNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-700 md:inline-flex">
              {session.role} session
            </span>
            <Button href={session.homePath} variant="secondary" size="sm">
              Open workspace
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Log out
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <section id="workspace" className="section-shell pt-8 sm:pt-12 lg:pt-16">
        <div className="hero-halo relative overflow-hidden rounded-[40px] border border-white/70 p-8 shadow-[0_34px_90px_-48px_rgba(15,23,42,0.44)] sm:p-10 lg:p-12">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] subtle-grid opacity-45 xl:block" />
          <div className="absolute -left-16 top-12 h-36 w-36 rounded-full bg-sky-300/28 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative grid gap-10 xl:grid-cols-[1.04fr_0.96fr] xl:items-center">
            <div className="max-w-3xl">
              <span className="eyebrow">{landing.eyebrow}</span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                {landing.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {landing.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={session.homePath} size="lg">
                  {landing.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href={landing.secondaryHref}
                  variant="secondary"
                  size="lg"
                >
                  {landing.secondaryCta}
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                {[
                  `Signed in as ${session.email}`,
                  `Preferred language: ${session.language}`,
                  `Role: ${session.role}`,
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200/80 bg-white/82 px-4 py-2"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {landing.metrics.map((metric, index) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  detail={metric.detail}
                  tone={index === 0 ? "dark" : index === 1 ? "sky" : "warm"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <SectionHeading
          eyebrow="Quick Access"
          title="Choose your next step"
          description="Jump directly into the part of the workspace you need without going through the full navigation first."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {landing.quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <article key={link.title} className="surface-card p-6">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                  {link.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {link.description}
                </p>
                <Button
                  href={link.href}
                  variant={link.tone}
                  size="lg"
                  className="mt-8 justify-between"
                >
                  {link.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section id="activity" className="section-shell mt-16">
        <SectionHeading
          eyebrow="Live Activity"
          title="The updates worth noticing first"
          description="A clear landing page should surface what matters now before you start moving through the workspace."
        />
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="surface-card p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-slate-950 p-3 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {landing.priorityTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {landing.priorityDescription}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {landing.priorities.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5"
                >
                  <p className="text-lg font-semibold text-slate-950">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {item.eyebrow}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-sky-600 p-3 text-white">
                <Bell className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {landing.signalTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {landing.signalDescription}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {landing.signals.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-slate-200/80 bg-white/88 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-slate-950">
                      {item.title}
                    </p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {item.eyebrow}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
