import Link from "next/link";
import { ArrowRight, Bell, Bot, CalendarClock, Sparkles } from "lucide-react";

import { MetricCard } from "@/components/ui/metric-card";
import {
  noticeBoard,
  studentOverviewMetrics,
  studentRiskItems,
  studentTasks,
} from "@/lib/student-data";

export default function DashboardOverviewPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {studentOverviewMetrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={index === 0 ? "dark" : index === 2 ? "warm" : "default"}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="surface-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Action queue</span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                What needs your attention now
              </h2>
            </div>
            <Link
              href="/dashboard/results"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"
            >
              Open results
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {studentTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-950">
                    {task.title}
                  </p>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {task.owner} • {task.due}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                Notice radar
              </p>
              <p className="text-sm text-slate-500">
                Latest department and university communication
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {noticeBoard.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                className="rounded-[24px] border border-slate-200/80 bg-white/88 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {notice.department}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                    {notice.priority}
                  </span>
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">
                  {notice.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {notice.summary}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-sky-600 p-3 text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                AI helpdesk intent lanes
              </p>
              <p className="text-sm text-slate-500">
                The frontend distinguishes record queries from document queries
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Current CGPA, marks, and result record questions",
              "Examination policy and revaluation guidance",
              "Hostel renewal instructions and campus services",
              "Language-aware responses with document citations",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/helpdesk"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Open helpdesk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-amber-500 p-3 text-white">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                Risk and readiness
              </p>
              <p className="text-sm text-slate-500">
                Frontend cues for what might block a smooth semester
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {studentRiskItems.map((risk) => (
              <div
                key={risk.title}
                className="rounded-[24px] border border-slate-200/80 bg-white/88 p-4"
              >
                <p className="text-base font-semibold text-slate-900">
                  {risk.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {risk.detail}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {risk.owner}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[26px] bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
              <Sparkles className="h-4 w-4" />
              Frontend note
            </div>
            <p className="mt-3 text-sm leading-7 text-white/78">
              These states are intentionally explicit so students can tell
              whether a problem comes from their own record, a pending office
              action, or missing source verification.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
