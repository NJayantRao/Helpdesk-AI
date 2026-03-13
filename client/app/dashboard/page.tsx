import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { studentOverviewMetrics, studentTasks } from "@/lib/student-data";

export default function DashboardPage() {
  return (
    <>
      <section className="grid gap-6 md:grid-cols-3">
        {studentOverviewMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="surface-card p-6">
        <span className="eyebrow">Quick actions</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Jump straight to what matters most
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Use these links to navigate to your workspace sections for results,
          notices, documents, and profile settings.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Button href="/dashboard/results" size="lg">
            View results
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/dashboard/notices" variant="secondary" size="lg">
            Read notices
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/dashboard/profile" variant="soft" size="lg">
            Profile settings
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="surface-card p-6">
        <span className="eyebrow">Top priorities</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Tasks worth checking
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          These are the highest priority actions based on your recent activity.
        </p>

        <div className="mt-6 space-y-4">
          {studentTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="rounded-[24px] border border-slate-200/80 bg-white/88 px-4 py-4 text-sm leading-6 text-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{task.due}</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                  {task.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Assigned by {task.owner}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
