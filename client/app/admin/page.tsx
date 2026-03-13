import { Activity, ShieldCheck, Users } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { adminMetrics, adminQueue, departmentHealth } from "@/lib/admin-data";

export default function AdminPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={index === 0 ? "dark" : index === 3 ? "warm" : "default"}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-slate-950 p-3 text-white">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <span className="eyebrow">Operations queue</span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Admin tasks that need attention
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {adminQueue.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50/85 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-950">
                    {item.title}
                  </p>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.owner} / {item.eta}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="space-y-4">
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <p className="text-lg font-semibold">Access lanes</p>
                  <p className="text-sm text-white/65">
                    Staff and system access stay separate from student-facing
                    navigation.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/88 p-5">
              <div className="flex items-center gap-3 text-slate-900">
                <Users className="h-5 w-5" />
                <span className="font-semibold">Workspace overview</span>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>
                  Keep documents, users, results, settings, and daily work in
                  separate sections so the admin area stays easy to use.
                </p>
                <p>
                  Use the navigation to move directly to the team or process you
                  need to manage.
                </p>
                <p>
                  The support bubble is also available here for quick guidance.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <DataTable
        caption="Department retrieval readiness"
        rows={departmentHealth}
        columns={[
          { key: "name", header: "Department" },
          {
            key: "coverage",
            header: "Coverage",
            render: (value) => (
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                {String(value)}
              </span>
            ),
          },
          {
            key: "readiness",
            header: "Readiness",
            render: (value) => (
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                {String(value)}
              </span>
            ),
          },
          { key: "note", header: "Operational note" },
        ]}
      />
    </>
  );
}
