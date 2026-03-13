import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  GraduationCap,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

import { AuthenticatedLanding } from "@/components/authenticated-landing";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getDemoSession } from "@/lib/auth";
import type { PublicNotice } from "@/lib/contracts";
import { publicNotices } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const heroHighlights: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Admissions",
    description:
      "Check eligibility, document requirements, and important public updates before applying.",
    icon: GraduationCap,
  },
  {
    title: "Notice board",
    description:
      "See the latest public notices from admissions, campus services, and departments in one place.",
    icon: Megaphone,
  },
  {
    title: "Campus updates",
    description:
      "Review important timelines and announcements without opening the student workspace.",
    icon: CalendarDays,
  },
];

const admissionOverviewCards = [
  {
    title: "Eligibility",
    description:
      "Check program-wise requirements, accepted entrance scores, and category-specific criteria before applying.",
    icon: GraduationCap,
    items: ["Program criteria", "Entrance scores", "Fee categories"],
  },
  {
    title: "Required Documents",
    description:
      "Prepare the essential academic, identity, and certificate documents early to avoid counseling delays.",
    icon: FileText,
    items: ["Mark sheets", "ID and photos", "Transfer certificates"],
  },
  {
    title: "Admission Timeline",
    description:
      "Follow the major milestones from application review to counseling, fee payment, and enrollment.",
    icon: CalendarDays,
    items: ["Application review", "Counseling dates", "Enrollment steps"],
  },
] as const;

const latestNotices = [
  ...publicNotices,
  {
    id: "public-4",
    title: "Exam timetable publication schedule announced",
    category: "Academic Notices",
    department: "Examination Cell",
    updatedAt: "Updated today",
    summary:
      "Theory and practical exam timetables will be published together so students can plan registrations and travel with less confusion.",
    visibility: "Public",
  },
] satisfies PublicNotice[];

const noticeBadgeStyles: Record<string, string> = {
  Admissions: "bg-sky-100 text-sky-800",
  "Campus Services": "bg-emerald-100 text-emerald-800",
  Events: "bg-amber-100 text-amber-800",
  "Academic Notices": "bg-slate-100 text-slate-700",
};

const accessCards: Array<{
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
}> = [
  {
    title: "Student sign-in",
    description:
      "Sign in to view results, private notices, documents, and your personal workspace.",
    cta: "Continue to login",
    icon: GraduationCap,
  },
  {
    title: "Admin sign-in",
    description:
      "Sign in to manage users, documents, results, and operational tasks.",
    cta: "Open staff login",
    icon: ShieldCheck,
  },
];

export default async function HomePage() {
  const session = await getDemoSession();

  if (session) {
    return <AuthenticatedLanding session={session} />;
  }

  return (
    <main className="pb-20">
      <SiteHeader />

      <section id="overview" className="section-shell pt-8 sm:pt-12 lg:pt-16">
        <div className="hero-halo relative overflow-hidden rounded-[40px] border border-white/70 p-8 shadow-[0_34px_90px_-48px_rgba(15,23,42,0.44)] sm:p-10 lg:p-12">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] subtle-grid opacity-45 xl:block" />
          <div className="absolute -left-16 top-12 h-36 w-36 rounded-full bg-sky-300/28 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative grid gap-10 xl:grid-cols-[1.06fr_0.94fr] xl:items-center">
            <div className="max-w-3xl">
              <span className="eyebrow">Official university portal</span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Admissions, notices, and campus updates in one place.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Browse public information first. Sign in only when you need
                personal records, private notices, or workspace access.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/login" size="lg">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="#notices" variant="secondary" size="lg">
                  View Notices
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {heroHighlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <article
                    key={highlight.title}
                    className="rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-[0_24px_54px_-40px_rgba(15,23,42,0.46)] backdrop-blur-xl"
                  >
                    <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                      {highlight.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {highlight.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="admissions" className="section-shell mt-16">
        <SectionHeading
          eyebrow="Admissions Overview"
          title="Start your application with the essentials"
          description="Focus on the public information most applicants need first: eligibility, required documents, and the admission timeline."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {admissionOverviewCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="surface-card p-6">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="notices" className="section-shell mt-16">
        <SectionHeading
          eyebrow="Latest Notices"
          title="Recent public updates from across the university"
          description="Scan the latest admissions, campus service, event, and academic notices without leaving the landing page."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {latestNotices.map((notice) => (
            <article key={notice.id} className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                    noticeBadgeStyles[notice.category] ??
                      "bg-slate-100 text-slate-600"
                  )}
                >
                  {notice.category}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {notice.updatedAt}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                {notice.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {notice.summary}
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {notice.department}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <SectionHeading
          eyebrow="Sign In"
          title="Continue to your workspace"
          description="Personal records and staff tools are available only after sign-in."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {accessCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="surface-card p-6 sm:p-8">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                  {card.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  {card.description}
                </p>
                <Button
                  href="/login"
                  size="lg"
                  className="mt-8 justify-between"
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
